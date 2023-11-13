import { z } from "zod";
import {
  ApiResponse,
  zodApiClient,
  zodApiResource,
} from "https://deno.land/x/zod_api@v0.3.1/mod.ts";
import partition from "https://deno.land/x/denodash@0.1.3/src/array/partition.ts";
import {
  BeatSaverMapByHashResponseSchema,
  BeatSaverMapResponseSuccessSchema,
} from "../types/beatsaver.ts";
import { fetcher } from "../fetcher/mod.ts";
import { getLogger } from "../logger/mod.ts";
import { fileExists } from "../fs/fileExists.ts";
import { LowercaseMapHash } from "../types/brands.ts";
import { s3client } from "@/packages/database/mod.ts";
import { buckets } from "@/packages/database/buckets.ts";

export const BeatSaverApi = zodApiClient({
  fetcher,
  baseUrl: "https://api.beatsaver.com/",
  logger: await getLogger(),
  resources: {
    mapById: zodApiResource("/maps/id/:id", {
      urlParamsSchema: z.object({
        id: z.string(),
      }),
      actions: {
        get: {
          dataSchema: BeatSaverMapResponseSuccessSchema,
        },
      },
    }),

    // up to 50 ids
    mapsByIds: zodApiResource("/maps/ids/:ids", {
      urlParamsSchema: z.object({
        ids: z.string(),
      }),
      actions: {
        get: {
          dataSchema: z.object({
            id: z.string().regex(/[0-9a-fA-F,]+/),
          }),
        },
      },
    }),

    // up to 50 hashes
    mapByHash: zodApiResource("/maps/hash/:hash", {
      urlParamsSchema: z.object({
        hash: z.string().regex(/[0-9a-f,]+/),
      }),
      actions: {
        get: {
          dataSchema: BeatSaverMapByHashResponseSchema,
        },
      },
    }),
  },
});

const getMapHashResponseCacheKey = (
  hash: LowercaseMapHash,
) => ["API_BEATSAVER", "MAP_HASH", "RESPONSE", hash];
export const cacheMapByHashIfNotExists = async (
  hash: string,
  downloadUrl: string,
) => {
  const mapPath = `./maps/${hash}.zip`;
  if (!fileExists(mapPath)) {
    const responseFile = await fetcher(downloadUrl);
    await Deno.writeFile(
      `./cache/${hash}.zip`,
      new Uint8Array(await responseFile.arrayBuffer()),
    );
  }
};

const fetchAndCacheHashesGetCache = (hashArray: LowercaseMapHash[]) => {
  return hashArray.map(async (lowercaseHash) => {
    const exists = await s3client.exists(lowercaseHash, {
      bucketName: buckets.beatSaver.mapByHash,
    });
    if (exists) {
      const response = await s3client.getObject(lowercaseHash, {
        bucketName: buckets.beatSaver.mapByHash,
      });
      const data = await response.json();

      return [lowercaseHash, data] as const;
    }
    return [lowercaseHash, undefined] as const;
  });
};

export const fetchAndCacheHashes = async (hashArray: LowercaseMapHash[]) => {
  const promises = [] as ReturnType<typeof BeatSaverApi.mapByHash.get>[];
  const partiallyResolved = await Promise.all(
    fetchAndCacheHashesGetCache(hashArray),
  );
  const resolvedFromCache = Object.fromEntries(
    partiallyResolved.filter(([, data]) => !!data),
  );
  const remainingHashArray = partiallyResolved.filter(([, data]) => !data).map((
    [lowercaseHash],
  ) => lowercaseHash);

  while (remainingHashArray.length > 0) {
    const hashQueue = remainingHashArray.splice(0, 50);
    const hashString = hashQueue.join(",");
    promises.push(BeatSaverApi.mapByHash.get({
      urlParams: {
        hash: hashString,
      },
    }));
  }

  const data = await Promise.all(promises);
  const object = data.map((x) => {
    return x.data;
  }).reduce(
    (prev, curr) => ({ ...prev, ...curr }),
    {},
  );

  try {
    const response = BeatSaverMapByHashResponseSchema.parse(object);
    const cacheResponse = BeatSaverMapByHashResponseSchema.parse(
      resolvedFromCache,
    );

    Object.entries(response)
      .forEach(([lowercaseHash, data]) =>
        s3client.putObject(lowercaseHash, JSON.stringify(data), {
          bucketName: buckets.beatSaver.mapByHash,
        })
      );

    return { ...response, ...cacheResponse };
  } catch (err) {
    console.error(err);
  }
};
