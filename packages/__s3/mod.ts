import "https://deno.land/std@0.206.0/dotenv/load.ts";

import { S3Client } from "s3_lite_client";
import { isDbEditorRemote, isLocal } from "@/packages/utils/envrionment.ts";

export namespace S3 {
  export const buckets = {
    playlist: {
      coverImage: "playlist-cover-image",
    },
    beatSaver: {
      mapByHash: "beatsaver-map-by-hash",
    },
  };

  const create = () => {
    return isLocal() && !isDbEditorRemote()
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
  };

  type Client = ReturnType<typeof create>;
  let client: Client | null = null;

  // keep it async just in case if a library will be swapped
  // and the new one will be with async constructor
  export const get = async (): Promise<Client> => {
    if (!client) {
      client = create();
    }

    return client;
  };
}
