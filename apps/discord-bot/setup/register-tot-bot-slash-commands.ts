import { REST, Routes, SlashCommandBuilder } from "npm:discord.js";

const DISCORD_TOT_BOT_CLIENT_ID = Deno.env.get("DISCORD_TOT_BOT_CLIENT_ID");
const DISCORD_TOT_BOT_TOKEN = Deno.env.get("DISCORD_TOT_BOT_TOKEN");

const rest = new REST().setToken(DISCORD_TOT_BOT_TOKEN!);

await rest.put(Routes.applicationGuildCommands("1171582001900421192", "689050370840068309"), { body: [] });

const pingCommand = new SlashCommandBuilder()
  .setName("ping")
  .setDescription("Test command / Test if bot is alive");


const playlistCommand = new SlashCommandBuilder()
  .setName("playlist")
  .setDescription("Get url to the playlist repository")

const applicationCommands = [
  pingCommand,
  playlistCommand
];

await rest.put(Routes.applicationCommands("1171582001900421192"), { body: applicationCommands.map(x => x.toJSON()) });

const registerCommand = async (body: any) => {
  const data = await fetch(
    `https://discord.com/api/v8/applications/${DISCORD_TOT_BOT_CLIENT_ID}/commands`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bot ${DISCORD_TOT_BOT_TOKEN}`,
      },
      body: JSON.stringify(body),
    },
  );

  const response = await data.json();
  if (data.status < 300) {
    console.log(body.name, data.status);
    return;
  }

  console.error(response);

  throw "Register command error";
};

try {
  // await registerCommand({
  //   name: "ping",
  //   description: "Test command / Test if bot is alive",
  //   options: [],
  // });

  await registerCommand({
    name: "createchannelplaylist",
    description: "(admin) Get debug output of what would be crated from given channel",
    options: [],
  });
  /*
  name: "name",
  description: "The name of the person",
  type: 3,
  required: true,
  */

  // await registerCommand({
  //   name: "playlists",
  //   description: "Get url to the playlist repository",
  //   options: [],
  // });
} catch (_) {
  console.error(_);
}
