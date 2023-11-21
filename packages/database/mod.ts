import "https://deno.land/std@0.206.0/dotenv/load.ts";
import { createPentagon } from "./pentagon.ts";
import { S3Client } from "s3_lite_client";
import { isLocal, isRemote } from "@/packages/utils/envrionment.ts";

const kv = isLocal() && !isRemote()
  ? await Deno.openKv("./local.db")
  : isRemote()
    ? await (async () => {
      Deno.env.set("DENO_KV_ACCESS_TOKEN", Deno.env.get("DD_EDITOR_KV_TOKEN")!);
      return await Deno.openKv(Deno.env.get("DD_EDITOR_KV_URL"));
    })()
    : await Deno.openKv();

export const db = createPentagon(kv);

export const s3client = isLocal() && !isRemote()
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
