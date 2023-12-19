import { z } from "zod";
import { executePing } from "@/apps/discord-bot/commands/commands/ping.ts";
import { CommandEmptyInteraction } from "@/apps/discord-bot/commands/types.ts";
import { executeCreateChannelPlaylist } from "@/apps/discord-bot/commands/commands/createChannelPlaylist.ts";
import { executePlaylists } from "@/apps/discord-bot/commands/commands/playlists.ts";
import {
  adminCommandRouting,
  AdminCommandRoutingGet,
  AdminCommandRoutingMark,
} from "@/apps/discord-bot/commands/definitions.ts";
import { respondWithMessage } from "@/apps/discord-bot/commands/utils.ts";

type CommandMapping = {
  "ping": CommandEmptyInteraction;
  "playlists": CommandEmptyInteraction;
};

function parsedToPath(parsed: typeof commandSchema._type) {
  return [
    parsed.data.name,
    parsed.data.options?.at(0)?.name,
    parsed.data.options?.at(0)?.options?.at(0)?.name,
    parsed.data.options?.at(0)?.options?.at(0)?.value,
  ] as const;
}

export async function router(commandEvent: unknown) {
  let parsed, main, group, subject, subjectValue;
  try {
    parsed = commandSchema.parse(commandEvent);
    [main, group, subject, subjectValue] = parsedToPath(parsed);

    switch (main) {
      case "admin":
        switch (group) {
          case "get":
            switch (subjectValue) {
              case adminCommandRouting.get.subject.get_playlist_debug_data:
                return await executeCreateChannelPlaylist(
                  commandEvent as AdminCommandRoutingGet,
                );
              default:
                throw "Routing problem admin get";
            }
          case "mark":
            switch (subjectValue) {
              case adminCommandRouting.mark.subject.mark_as_playlist_channel:
                // return await executeCreateChannelPlaylist(commandEvent as AdminCommandRoutingMark);
                throw "Unimplemented";
              default:
                throw "Routing problem admin mark";
            }
          default:
            throw "Routing problem admin";
        }
      case "playlists":
        return executePlaylists();
      case "ping":
        return executePing();
      default:
        throw "Routing problem";
    }
  } catch (error) {
    if (parsed) {
      console.log(commandEvent);
      console.log(main, group, subject, subjectValue);
      console.log(parsed);
      console.log("404 Command not found", error);
      return respondWithMessage("404 Command not found", true);
    }
    console.log(commandEvent);
    console.log("400 Command invalid", error);
    return respondWithMessage("400 Command invalid", true);
  }
}

const commandSchemaOptionLeaf = z.object({
  name: z.string(),
  type: z.number(),
  value: z.string().optional(),
});
const commandSchemaOptionBranch = z.object({
  name: z.string(),
  options: z.optional(z.array(commandSchemaOptionLeaf)),
  type: z.number(),
  value: z.string().optional(),
});
const commandSchemaInner = z.object({
  name: z.string(),
  options: z.optional(z.array(
    commandSchemaOptionBranch,
  )),
  type: z.number(),
});
const commandSchema = z.object({
  data: commandSchemaInner,
});

function isCommandOfType<T extends keyof CommandMapping>(
  commandEvent: unknown,
  path: string,
  nameOfCommand: T,
): commandEvent is CommandMapping[T] {
  try {
    const parsed = commandSchema.parse(commandEvent);
    parsed.data.name;
    return (
      parsed.data.name === nameOfCommand
    );
  } catch (parseError) {
    console.log("isCommandOfType", parseError);
    return false;
  }
}
