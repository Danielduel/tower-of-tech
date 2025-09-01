import { z } from "zod";
import { DB } from "@tot/db";
import { S3 } from "@tot/s3";
import { LowercaseMapHash, makeLowercaseMapHash } from "@/packages/types/brands.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { fetchHashes } from "@/packages/api-beatsaver/mod.ts";

const watcherName = "api-beatsaver-cache-worker";

const CacheRequestSchema = z.object({
  for: z.literal(watcherName),
  body: z.array(z.string().transform(makeLowercaseMapHash)),
});

export const scheduleCache = async (hashes: LowercaseMapHash[]) => {
  if (hashes.length === 0) return;
  const kv = await DB.getKv();

  console.log("Queueing ", hashes.length);
  const remainingHashes = [...hashes];
  console.log(remainingHashes);

  let delayS = 1;
  while (remainingHashes.length > 0) {
    const items = remainingHashes.splice(0, 1);
    console.log(`Enqueue ${items}`);
    await kv.enqueue({
      for: watcherName,
      body: items,
    }, {
      delay: delayS * 1000,
    });
    delayS++;
  }
};

export const runWorkerBody = async (
  parsed: typeof CacheRequestSchema._type,
) => {
  const s3 = await S3.get();
  const filteredHashes = (await Promise.all(
    parsed.body
      .map(async (lowercaseHash) => {
        const exists = await s3.exists(lowercaseHash, {
          bucketName: S3.buckets.beatSaver.mapByHash,
        });

        if (exists) return null;

        return lowercaseHash;
      }),
  ))
    .filter(filterNulls);

  console.log(
    `Caching\n${JSON.stringify(filteredHashes)}\nto ${S3.buckets.beatSaver.mapByHash}`,
  );

  let response = await fetchHashes(filteredHashes);
  if ("error" in response) {
    console.log(`Error for ${JSON.stringify(response)}`);
    return;
  }
  if ("id" in response) {
    response = { [filteredHashes[0]]: response };
  }

  if (!response) return;

  await Promise.all(
    Object.entries(response).map(async ([hash, data]) => {
      await s3.putObject(hash, JSON.stringify(data), {
        bucketName: S3.buckets.beatSaver.mapByHash,
      });
    }),
  );

  console.log(
    `Cached ${filteredHashes[0]} to ${S3.buckets.beatSaver.mapByHash}`,
  );
};

export const runWorker = async () => {
  const kv = await DB.getKv();
  kv.listenQueue(async (msg: unknown) => {
    try {
      const parsed = CacheRequestSchema.parse(msg);

      await runWorkerBody(parsed);
    } catch (_) {
      return;
      // expected
    }
  });
};
