import { executeHello } from "./commands/hello.ts";
import { executePlaylists } from "./commands/playlists.ts";
import { CommandHelloInteraction, CommandPlaylistsInteraction } from "@/apps/discord-bot/commands/types.ts";

type CommandMapping = {
  hello: CommandHelloInteraction;
  playlists: CommandPlaylistsInteraction;
};

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

export async function router(commandEvent: unknown) {
  if (isCommandOfType(commandEvent, "hello")) {
    return executeHello(commandEvent);
  }

  if (isCommandOfType(commandEvent, "playlists")) {
    return executePlaylists(commandEvent);
  }

  return;
}
