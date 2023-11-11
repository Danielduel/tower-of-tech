import { createPentagon } from "pentagon";
import { S3Client } from "s3_lite_client";
import { isDevelopment } from "@/utils/envrionment.ts";
import { BeatSaberPlaylist, BeatSaberPlaylistSongItem } from "@/database/BeatSaberPlaylist.ts";
import { BeatSaverResponseWrapper, BeatSaverMapResponseSuccess } from "@/database/BeatSaverResponse.ts";

const kv = isDevelopment()
  ? await Deno.openKv("./local.db")
  : await Deno.openKv();

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
