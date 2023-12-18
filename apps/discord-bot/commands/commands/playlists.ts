import { CommandPlaylistsInteraction } from "../types.ts";
import { respondWithMessage } from "../utils.ts";

export function executePlaylists(commandEvent: CommandPlaylistsInteraction) {
  return respondWithMessage(
    `There is the link to current playlists <https://github.com/Danielduel/tower-of-tech/releases/>!`,
  );
}
