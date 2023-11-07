import { createPentagon } from "pentagon";
import { S3Client } from "s3_lite_client";
import { BeatSaberPlaylist, BeatSaberPlaylistSongItem } from "./BeatSaberPlaylist.ts";
import { BeatSaverResponseWrapper, BeatSaverMapResponseSuccess } from "./BeatSaverResponse.ts";

const kv = await Deno.openKv("./local.db");

export const db = createPentagon(kv, {
  BeatSaverResponseWrapper,
  BeatSaverMapResponseSuccess,
  BeatSaberPlaylist,
  BeatSaberPlaylistSongItem
});

export const s3client = new S3Client({
  endPoint: "localhost",
  port: 8014,
  useSSL: false,
  region: "dev-region",
  accessKey: "AKEXAMPLES3S",
  secretKey: "SKEXAMPLES3S",
  bucket: "dev-bucket",
  pathStyle: true,
});

// setInterval(async () => {
//   console.log("Listing")
//   const entries = kv.list({ prefix: [] });
//   for await (const entry of entries) {
//     console.log(entry);
//   }
// }, 1000)
