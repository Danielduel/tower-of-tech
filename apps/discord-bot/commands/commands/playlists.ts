import { respondWithMessage } from "@/apps/discord-bot/commands/utils.ts";

export function executePlaylists() {
  return respondWithMessage(
    `There is the link to current playlists <https://github.com/Danielduel/tower-of-tech/releases/>!`,
  );
}
