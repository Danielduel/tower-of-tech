import { REST, Routes } from "npm:discord.js";
import { pingCommand, playlistCommand, adminCommand } from "@/apps/discord-bot/commands/definitions.ts";

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
