import { createPentagon } from "https://deno.land/x/pentagon@v0.1.5/mod.ts";
import { BeatSaberPlaylist, BeatSaberPlaylistSongItem } from "./BeatSaberPlaylist.ts";
import { BeatSaverResponseWrapper, BeatSaverMapResponseSuccess } from "./BeatSaverResponse.ts";

const kv = await Deno.openKv("./local.db");

export const db = createPentagon(kv, {
  BeatSaverResponseWrapper,
  BeatSaverMapResponseSuccess,
  BeatSaberPlaylist,
  BeatSaberPlaylistSongItem
});

// setInterval(async () => {
//   console.log("Listing")
//   const entries = kv.list({ prefix: [] });
//   for await (const entry of entries) {
//     console.log(entry);
//   }
// }, 1000)
