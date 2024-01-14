import "https://deno.land/std@0.206.0/dotenv/load.ts";
import { S3Client } from "s3_lite_client";
import { isLocal, isDbEditorRemote } from "@/packages/utils/envrionment.ts";
import {
  BeatSaberPlaylist,
  BeatSaberPlaylistSongItem,
} from "@/packages/database-editor/BeatSaberPlaylist.ts";
import {
  BeatSaverIdToHashCache,
  BeatSaverMapResponseSuccess,
  BeatSaverResponseWrapper,
} from "@/packages/database-editor/BeatSaverResponse.ts";
import { kvdex } from "kvdex/mod.ts";

export const kv = isDbEditorRemote()
  ? await (async () => {
    Deno.env.set("DENO_KV_ACCESS_TOKEN", Deno.env.get("DD_EDITOR_KV_TOKEN")!);
    return await Deno.openKv(Deno.env.get("DD_EDITOR_KV_URL"));
  })()
  : isLocal()
    ? await Deno.openKv("./local.db")
    : await Deno.openKv();

export const dbEditor = kvdex(kv, {
  BeatSaverResponseWrapper,
  BeatSaverMapResponseSuccess,
  BeatSaberPlaylist,
  BeatSaberPlaylistSongItem,
  BeatSaverIdToHashCache,
});

export const s3clientEditor = isLocal() && !isDbEditorRemote()
  ? new S3Client({
    endPoint: "localhost",
    port: 8014,
    useSSL: false,
    region: "dev-region",
    accessKey: "AKEXAMPLES3S",
    secretKey: "SKEXAMPLES3S",
    bucket: "dev-bucket",
    pathStyle: true,
  })
  : new S3Client({
    endPoint: Deno.env.get("S3_URL")!,
    port: 443,
    region: "auto",
    useSSL: true,
    accessKey: Deno.env.get("S3_KEY_ID"),
    secretKey: Deno.env.get("S3_SECRET_ACCESS_KEY"),
    bucket: "dev-bucket",
    pathStyle: true,
  });
