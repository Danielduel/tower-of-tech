// const response = BeatSaverMapByHashResponseSchema.parse(object);
// if (response) {
//   await Promise.all(Object.entries(response)
//     .map(([lowercaseHash, data]) =>
//       s3clientEditor.putObject(lowercaseHash, JSON.stringify(data), {
//         bucketName: buckets.beatSaver.mapByHash,
//       })
//     ));
// }

import { kv, s3clientEditor } from "@/packages/database-editor/mod.ts";
import {
  LowercaseMapHash,
  makeLowercaseMapHash,
} from "@/packages/types/brands.ts";
import { z } from "zod";
import { buckets } from "@/packages/database-editor/buckets.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { BeatSaverApi } from "@/packages/api-beatsaver/mod.ts";

const watcherName = "api-beatsaver-cache-worker";

const CacheRequestSchema = z.object({
  for: z.literal(watcherName),
  body: z.array(z.string().transform(makeLowercaseMapHash)),
});

export const scheduleCache = async (hashes: LowercaseMapHash[]) => {
  console.log("Queueing ", hashes.length)
  const remainingHashes = [...hashes];

  let delayS = 1;
  while (remainingHashes.length > 0) {
    const items = remainingHashes.splice(0, 1);
    await kv.enqueue({
      for: watcherName,
      body: items,
    }, {
      delay: delayS * 1000
    });
    delayS++;
  }
};

export const runWorker = () => {
  kv.listenQueue(async (msg: unknown) => {
    try {
      const parsed = CacheRequestSchema.parse(msg);

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
      
      console.log(`Caching ${filteredHashes[0]} to ${buckets.beatSaver.mapByHash}`);

      const response = await BeatSaverApi.mapByHashSingle.get({ urlParams: { hash: filteredHashes[0] }});

      if (!response) return;

      await s3clientEditor.putObject(filteredHashes[0], JSON.stringify(response), {
        bucketName: buckets.beatSaver.mapByHash,
      })
      
      console.log(`Cached ${filteredHashes[0]} to ${buckets.beatSaver.mapByHash}`);
    } catch (_) {
      // expected
    }
  });
};
