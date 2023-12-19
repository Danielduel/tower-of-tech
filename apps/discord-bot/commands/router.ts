import { executePing } from "@/apps/discord-bot/commands/commands/ping.ts";
import { CommandEmptyInteraction } from "@/apps/discord-bot/commands/types.ts";
import { executeCreateChannelPlaylist } from "@/apps/discord-bot/commands/commands/createChannelPlaylist.ts";
import { executePlaylists } from "@/apps/discord-bot/commands/commands/playlists.ts";
import {
  AdminCommandRoutingGet,
  AdminCommandRoutingMark,
} from "@/apps/discord-bot/commands/definitions.ts";
import { respondWithMessage } from "@/apps/discord-bot/commands/utils.ts";

type CommandMapping = {
  "ping": CommandEmptyInteraction;
  "playlists": CommandEmptyInteraction;
  "admin get": AdminCommandRoutingGet;
  "admin mark": AdminCommandRoutingMark;
};

export async function router(commandEvent: unknown) {
  if (isCommandOfType(commandEvent, "admin get")) {
    return await executeCreateChannelPlaylist(commandEvent);
  }

  if (isCommandOfType(commandEvent, "playlists")) {
    return executePlaylists();
  }

  if (isCommandOfType(commandEvent, "ping")) {
    return executePing();
  }

  if (isCommandValid(commandEvent)) {
    console.log(commandEvent.data.name);
    console.log(commandEvent.data.options);
    return respondWithMessage("404 Command not found", true);
  } else {
    console.log(commandEvent);
    return respondWithMessage("400 Command invalid", true);
  }
}

function isCommandOfType<T extends keyof CommandMapping>(
  commandEvent: unknown,
  nameOfCommand: T,
): commandEvent is CommandMapping[T] {
  return (
    typeof commandEvent === "object" &&
    !!commandEvent &&
    "data" in commandEvent &&
    !!commandEvent.data &&
    typeof commandEvent.data === "object" &&
    "name" in commandEvent.data && typeof commandEvent.data.name === "string" &&
    commandEvent.data.name === nameOfCommand
  );
}

function isCommandValid<T extends keyof CommandMapping>(
  commandEvent: unknown
): commandEvent is CommandEmptyInteraction {
  return (
    typeof commandEvent === "object" &&
    !!commandEvent &&
    "data" in commandEvent &&
    !!commandEvent.data &&
    typeof commandEvent.data === "object" &&
    "name" in commandEvent.data && typeof commandEvent.data.name === "string"
  );
}
