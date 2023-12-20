import { REST, Routes, SlashCommandBuilder } from "npm:discord.js";
import { adminCommandRouting } from "@/apps/discord-bot/commands/definitions.ts";

const pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Test command / Test if bot is alive");

const playlistCommand = new SlashCommandBuilder()
  .setName("playlist")
  .setDescription("Get url to the playlist repository");

const adminCommand = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Use management commands")
  .addSubcommandGroup((sg) =>
    sg
      .setName("channel")
      .setDescription("Use channel management commands")
      .addSubcommand((sc) =>
        sc
          .setName("register")
          .setDescription("Expose this channel to the bot")
      )
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

const DISCORD_TOT_BOT_CLIENT_ID = Deno.env.get("DISCORD_TOT_BOT_CLIENT_ID")!;
const DISCORD_TOT_BOT_TOKEN = Deno.env.get("DISCORD_TOT_BOT_TOKEN")!;

const rest = new REST().setToken(DISCORD_TOT_BOT_TOKEN);

await rest.put(Routes.applicationGuildCommands(DISCORD_TOT_BOT_CLIENT_ID, "689050370840068309"), { body: [] });

const applicationCommands = [
  pingCommand,
  playlistCommand,
  adminCommand
];

await rest.put(Routes.applicationCommands(DISCORD_TOT_BOT_CLIENT_ID), { body: applicationCommands.map(x => x.toJSON()) });
