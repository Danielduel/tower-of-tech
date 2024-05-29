import { respondWithMessage } from "@/packages/discord/commands/utils.ts";

export function executePlaylists() {
  return respondWithMessage(
    `There is the link to current playlists <https://github.com/Danielduel/tower-of-tech/releases/>!`,
  );
}
