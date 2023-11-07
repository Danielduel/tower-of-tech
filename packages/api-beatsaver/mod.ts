import { z } from "zod";
import {
  ApiResponse,
  zodApiClient,
  zodApiResource,
} from "https://deno.land/x/zod_api@v0.3.1/mod.ts";
import partition from "https://deno.land/x/denodash@0.1.3/src/array/partition.ts";
import { BeatSaverMapResponseSuccessSchema } from "../types/beatsaver.ts";
import { fetcher } from "../fetcher/mod.ts";
import { getLogger } from "../logger/mod.ts";
import { fileExists } from "../fs/fileExists.ts";
import { LowercaseMapHash } from "../types/brands.ts";

const mapByHashResponse = z.record(
  z.string().regex(/[0-9a-f,]+/),
  z.nullable(BeatSaverMapResponseSuccessSchema),
);
type MapByHashResponse = typeof mapByHashResponse._type;

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
          dataSchema: mapByHashResponse,
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

// const resolveItemFromCache = async (hash: LowercaseMapHash) => {
//   return [
//     hash,
//     undefined // await getItem<MapByHashResponse>(getMapHashResponseCacheKey(hash)),
//   ] as const;
// };

// const resolveBatchInner = async function* (hashArray: LowercaseMapHash[]) {
//   const itemsResolvedFromCacheMixedWithMissingItems = await Promise.all(
//     hashArray
//       .map((hash) => resolveItemFromCache(hash)),
//   );

//   const [itemsFromCache, unresolvedItems] = partition(
//     itemsResolvedFromCacheMixedWithMissingItems,
//     itemsResolvedFromCacheMixedWithMissingItems.map((item) =>
//       item === undefined
//     ),
//   );

// };

// const resolveBatch = async (hashArray: LowercaseMapHash[]) => {
//   const inner = resolveBatchInner(hashArray);
//   let hashes = [] as LowercaseMapHash[];
//   const requestPromises = [] as Promise<ApiResponse<MapByHashResponse>>[];

//   for await (const hash of inner) {
//     hashes.push(hash);

//     if (hashes.length === 50) {
//       requestPromises.push(
//         BeatSaverApi.mapByHash.get(
//           {
//             urlParams: {
//               hash: hashes.join(","),
//             },
//           },
//         ),
//       );
//       hashes = [];
//     }
//   }
// };

export const fetchAndCacheHashes = async (hashArray: LowercaseMapHash[]) => {
  // const uncachedHashArray = hashArray
  // const batch = await resolveBatch(hashArray);

  const promises = [] as ReturnType<typeof BeatSaverApi.mapByHash.get>[];

  while (hashArray.length > 0) {
    const hashQueue = hashArray.splice(0, 50);
    const hashString = hashQueue.join(",");
    promises.push(BeatSaverApi.mapByHash.get({
      urlParams: {
        hash: hashString,
      },
    }))
  }

  const data = await Promise.all(promises);
  const object = data.map(x => x.data).reduce((prev, curr) => ({ ...prev, ...curr }), {});
  
  try {
    const response = mapByHashResponse.parse(object);
    return response;
  } catch (err) { console.error(err) }
};
