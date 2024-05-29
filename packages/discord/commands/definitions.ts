import {
  CommandInteraction,
  DefinedStringOption,
} from "@/packages/discord/commands/types.ts";

export type AdminCommandRoutingGet = CommandInteraction<
  [DefinedStringOption<"subject", "get_playlist_debug_data">]
>;
export type AdminCommandRoutingMark = CommandInteraction<
  [DefinedStringOption<"subject", "mark_as_playlist_channel">]
>;

export const adminCommandRouting = {
  get: {
    subject: {
      "get_playlist_debug_data": "get_playlist_debug_data",
    } as const,
  },
  mark: {
    subject: {
      "mark_as_playlist_channel": "mark_as_playlist_channel",
    } as const,
  },
};
