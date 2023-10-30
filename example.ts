import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { createPentagon } from "pentagon";
import {
  BeatSaverMapResponse,
  BeatSaverMapResponseSuccess,
  makeBeatSaverMapId,
} from "./packages/types/beatsaver.ts";
import { BeatSaverApi, resolveBatchFromCache } from "./packages/api-beatsaver/mod.ts";
import { readPlaylistFile } from "./packages/beatsaber-playlist/mod.ts";
import { LowercaseMapHash } from "./packages/types/brands.ts";
import { fetcher } from "./packages/fetcher/mod.ts";
const kv = await Deno.openKv("./local.db");

const BeatSaverResponseWrapper = z.object({
  id: z.string().transform(makeBeatSaverMapId),
  createdAt: z.date(),
  available: z.boolean(),
  removed: z.boolean(),
});

const db = createPentagon(kv, {
  BeatSaverResponseWrapper: {
    schema: BeatSaverResponseWrapper,
    relations: {
      child: [
        "BeatSaverMapResponseSuccess",
        BeatSaverMapResponseSuccess,
        "id",
        "id",
      ],
    },
  },
  BeatSaverMapResponseSuccess: {
    schema: BeatSaverMapResponseSuccess,
    relations: {
      parent: ["BeatSaverMap", BeatSaverResponseWrapper, "id", "id"],
    },
  },
});

// const sourcePath = new URL(import.meta.resolve("./data/playlists")).pathname;
// const dirListing = [...Deno.readDirSync(sourcePath)]
//   .filter((item) => item.isFile);
// const playlists = dirListing.map((file) => readPlaylistFile(`${sourcePath}/${file.name}`))
// console.log(playlists.length);
// const hashArray = playlists
//   .flatMap(p => p.songs)
//   .map(song => song.hash);

// const promises = [] as Promise<void>[];
// while (hashArray.length > 0) {
//   const hashQueue = hashArray.splice(0, 50);
//   const hashString = hashQueue.join(",");
//   testBeatSaverApi(hashString.toLowerCase() as LowercaseMapHash)
// }
// await Promise.all(promises);


await resolveBatchFromCache(["6c1318a687ddd44f172948ffd8fcf6872293bd37"] as LowercaseMapHash[])