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
import { fetchHashes } from "@/packages/api-beatsaver/mod.ts";

const watcherName = "api-beatsaver-cache-worker";

const CacheRequestSchema = z.object({
  for: z.literal(watcherName),
  body: z.array(z.string().transform(makeLowercaseMapHash)),
});

export const scheduleCache = async (hashes: LowercaseMapHash[]) => {
  console.log("Queueing ", hashes.length)
  const remainingHashes = [...hashes];

  while (remainingHashes.length > 0) {
    const items = remainingHashes.splice(0, 2);
    await kv.enqueue({
      for: watcherName,
      body: items,
    });
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
      
      console.log(`Caching ${filteredHashes.length} items to ${buckets.beatSaver.mapByHash}`);

      const response = await fetchHashes(filteredHashes);

      if (!response) return;

      const cached = await Promise.all(Object.entries(response)
        .map(([lowercaseHash, data]) =>
          s3clientEditor.putObject(lowercaseHash, JSON.stringify(data), {
            bucketName: buckets.beatSaver.mapByHash,
          })
        ));
      
      console.log(`Cached ${cached.length} items to ${buckets.beatSaver.mapByHash}`);
    } catch (_) {
      // expected
    }
  });
};
