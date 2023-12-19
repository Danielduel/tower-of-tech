import {
  serve,
} from "https://deno.land/x/sift@0.6.0/mod.ts";
import { commandRoot } from "@/apps/discord-bot/commands/mod.ts";
import { playlistFromGuildChannel } from "@/apps/discord-bot/commands/api/playlistFromGuildChannel.ts";

export function registerServeHttp() {
  serve({
    "/api/playlist/guild/:guildId/channel/:channelId": playlistFromGuildChannel,
    "/": commandRoot,
  });
}
