import { kvdex } from "kvdex/mod.ts";
import "https://deno.land/std@0.206.0/dotenv/load.ts";
import { isDbDiscordBotRemote, isLocal } from "@/packages/utils/envrionment.ts";
import {
  DiscordChannel,
  DiscordGuild,
} from "@/packages/database-discord-bot/DiscordGuild.ts";

const kv = isLocal() && !isDbDiscordBotRemote()
  ? await Deno.openKv("./local.db")
  : isDbDiscordBotRemote()
  ? await (async () => {
    Deno.env.set(
      "DENO_KV_ACCESS_TOKEN",
      Deno.env.get("DD_DISCORD_BOT_KV_TOKEN")!,
    );
    return await Deno.openKv(Deno.env.get("DD_DISCORD_BOT_KV_URL"));
  })()
  : await Deno.openKv();

export const dbDiscordBot = kvdex(kv, {
  DiscordChannel,
  DiscordGuild,
});
