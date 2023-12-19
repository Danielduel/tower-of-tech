import { SlashCommandBuilder } from "npm:discord.js";
import { CommandInteraction, DefinedStringOption } from "@/apps/discord-bot/commands/types.ts";

export const pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Test command / Test if bot is alive");

export const playlistCommand = new SlashCommandBuilder()
  .setName("playlist")
  .setDescription("Get url to the playlist repository");

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
export type AdminCommandRoutingGet = CommandInteraction<[ DefinedStringOption<"subject", "get_playlist_debug_data"> ]>;
export type AdminCommandRoutingMark = CommandInteraction<[ DefinedStringOption<"subject", "mark_as_playlist_channel"> ]>;

export const adminCommand = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Use management commands")
  .addSubcommandGroup((sg) =>
    sg
      .setName("channel")
      .setDescription("Use channel management commands")
      .addSubcommand((sc) =>
        sc
          .setName("get")
          .setDescription("Get data from this channel")
          .addStringOption((o) =>
            o
              .setName("subject")
              .setDescription("What kind of data do you need?")
              .setRequired(true)
              .addChoices(
                {
                  name: "Get the playlist debug data.",
                  value:
                    adminCommandRouting.get.subject.get_playlist_debug_data,
                },
              )
          )
      )
      .addSubcommand((sc) =>
        sc
          .setName("mark")
          .setDescription("Mark this channel for custom functions")
          .addStringOption((o) =>
            o
              .setName("subject")
              .setDescription("What kind of special function?")
              .setRequired(true)
              .addChoices(
                {
                  name: "Mark this channel as a playlist channel.",
                  value:
                    adminCommandRouting.mark.subject.mark_as_playlist_channel,
                },
              )
          )
          .addBooleanOption((o) =>
            o
              .setName("switch")
              .setDescription("Should be enabled?")
          )
      )
  );
