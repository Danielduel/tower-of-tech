import { z } from "zod";
import { executePing } from "@/packages/discord/commands/commands/ping.ts";
import { adminChannelGetPlaylist } from "@/packages/discord/commands/commands/adminChannelGetPlaylist.ts";
import { executePlaylists } from "@/packages/discord/commands/commands/playlists.ts";
import { adminCommandRouting } from "@/packages/discord/commands/routing.config.ts";
import { respondWithMessage } from "@/packages/discord/commands/utils.ts";
import { adminChannelMarkAsPlaylist } from "@/packages/discord/commands/commands/adminChannelMarkAsPlaylist.ts";
import { adminChannelRegister } from "@/packages/discord/commands/commands/adminChannelRegister.ts";
import { DiscordInteraction } from "@/packages/discord/deps.ts";

function parsedToPath(parsed: typeof commandSchema._type) {
  return [
    parsed.data.name,
    parsed.data.options?.at(0)?.name,
    parsed.data.options?.at(0)?.options?.at(0)?.name,
    parsed.data.options?.at(0)?.options?.at(0)?.options?.at(0)?.value,
    parsed.data.options?.at(0)?.options?.at(0)?.options?.at(1)?.value,
  ] as const;
}

export async function router(commandEvent: DiscordInteraction) {
  let parsed, main, group, verb, subjectValue, switchValue;
  try {
    parsed = commandSchema.parse(commandEvent);
    // console.log(JSON.stringify(parsed));
    [main, group, verb, subjectValue, switchValue] = parsedToPath(parsed);

    switch (main) {
      case "admin":
        switch (group) {
          case "channel": {
            switch (verb) {
              case "register":
                return await adminChannelRegister(
                  commandEvent as DiscordInteraction,
                );
              case "get":
                switch (subjectValue) {
                  case adminCommandRouting.get.subject.get_playlist_debug_data:
                    return await adminChannelGetPlaylist(
                      commandEvent as DiscordInteraction,
                    );
                  default:
                    throw "Routing problem admin channel get";
                }
              case "mark":
                switch (subjectValue) {
                  case adminCommandRouting.mark.subject
                    .mark_as_playlist_channel:
                    return await adminChannelMarkAsPlaylist(
                      commandEvent as DiscordInteraction,
                      switchValue as boolean,
                    );
                  default:
                    throw "Routing problem admin channel mark";
                }
              default:
                throw "Routing problem admin channel";
            }
          }
          default:
            throw "Routing problem admin";
        }
      case "playlist":
        return executePlaylists();
      case "ping":
        return executePing();
      default:
        throw "Routing problem";
    }
  } catch (error) {
    if (parsed) {
      console.log(commandEvent);
      console.log(main, group, verb, subjectValue);
      console.log(parsed);
      console.log("404 Command not found", error);
      return respondWithMessage("404 Command not found", true);
    }
    console.log(commandEvent);
    console.log("400 Command invalid", error);
    return respondWithMessage("400 Command invalid", true);
  }
}

type CommandSchemaOptionType = {
  name: string;
  options?: CommandSchemaOptionType[];
  type: number;
  value?: string | boolean;
};
const commandSchemaOption: z.ZodType<CommandSchemaOptionType> = z.lazy(() =>
  z.object({
    name: z.string(),
    options: z.optional(z.array(commandSchemaOption)),
    type: z.number(),
    value: z.union([z.boolean(), z.string()]).optional(),
  })
);
const commandSchemaInner = z.object({
  name: z.string(),
  options: z.optional(z.array(
    commandSchemaOption,
  )),
  type: z.number(),
});
const commandSchema = z.object({
  data: commandSchemaInner,
});
