import {
  serve,
} from "https://deno.land/x/sift@0.6.0/mod.ts";
import { commandRoot } from "@/apps/discord-bot/commands/mod.ts";
import { globalPlaylist } from "@/apps/discord-bot/commands/api/globalPlaylist.ts";

export function registerServeHttp() {
  serve({
    "/api/globalPlaylist": globalPlaylist,
    "/": commandRoot,
  });
}
