import { createPentagon as _createPentagon } from "pentagon";
import { DiscordChannel, DiscordGuild } from "@/packages/database-discord-bot/DiscordGuild.ts";

export const createPentagon = (kv: Deno.Kv) => {
  return _createPentagon(kv, {
    DiscordChannel,
    DiscordGuild
  });
};
