import { z } from "zod";
import { kv, s3clientEditor } from "@/packages/database-editor/mod.ts";
import { LowercaseMapHash, makeLowercaseMapHash } from "@/packages/types/brands.ts";
import { buckets } from "@/packages/database-editor/buckets.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { fetchHashes } from "@/packages/api-beatsaver/mod.ts";

const watcherName = "api-beatsaver-cache-worker";

const CacheRequestSchema = z.object({
  for: z.literal(watcherName),
  body: z.array(z.string().transform(makeLowercaseMapHash)),
});

export const scheduleCache = async (hashes: LowercaseMapHash[]) => {
  if (hashes.length === 0) return;

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
  const filteredHashes = (await Promise.all(
    parsed.body
      .map(async (lowercaseHash) => {
        const exists = await s3clientEditor.exists(lowercaseHash, {
          bucketName: buckets.beatSaver.mapByHash,
        });

        if (exists) return null;

        return lowercaseHash;
      }),
  ))
    .filter(filterNulls);

  console.log(
    `Caching\n${JSON.stringify(filteredHashes)}\nto ${buckets.beatSaver.mapByHash}`,
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
      await s3clientEditor.putObject(hash, JSON.stringify(data), {
        bucketName: buckets.beatSaver.mapByHash,
      });
    }),
  );

  console.log(
    `Cached ${filteredHashes[0]} to ${buckets.beatSaver.mapByHash}`,
  );
};

export const runWorker = () => {
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
