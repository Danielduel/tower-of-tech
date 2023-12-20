import "https://deno.land/std@0.206.0/dotenv/load.ts";
import { createPentagon } from "./pentagon.ts";
import { isLocal, isDbDiscordBotRemote } from "@/packages/utils/envrionment.ts";

const kv = isLocal() && !isDbDiscordBotRemote()
  ? await Deno.openKv("./local.db")
  : isDbDiscordBotRemote()
    ? await (async () => {
      Deno.env.set("DENO_KV_ACCESS_TOKEN", Deno.env.get("DD_DISCORD_BOT_KV_TOKEN")!);
      return await Deno.openKv(Deno.env.get("DD_DISCORD_BOT_KV_URL"));
    })()
    : await Deno.openKv();

export const dbDiscordBot = createPentagon(kv);
