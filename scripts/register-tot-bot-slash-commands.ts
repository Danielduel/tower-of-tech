import { load } from "https://deno.land/std@0.205.0/dotenv/mod.ts";

const {
  DISCORD_TOT_BOT_CLIENT_ID,
  DISCORD_TOT_BOT_TOKEN,
} = await load();

fetch(
  `https://discord.com/api/v8/applications/${DISCORD_TOT_BOT_CLIENT_ID}/commands`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bot ${DISCORD_TOT_BOT_TOKEN}`,
    },
    body: JSON.stringify({
      name: "hello",
      description: "Test command / Test if bot is alive",
      options: [{
        name: "name",
        description: "The name of the person",
        type: 3,
        required: true,
      }],
    }),
  },
);

fetch(
  `https://discord.com/api/v8/applications/${DISCORD_TOT_BOT_CLIENT_ID}/commands`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bot ${DISCORD_TOT_BOT_TOKEN}`,
    },
    body: JSON.stringify({
      name: "playlists",
      description: "Get url to the playlist repository"
    }),
  },
);
