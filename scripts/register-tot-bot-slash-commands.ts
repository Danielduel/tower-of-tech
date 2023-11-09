import { load } from "https://deno.land/std@0.205.0/dotenv/mod.ts";

const {
  DISCORD_TOT_BOT_CLIENT_ID,
  DISCORD_TOT_BOT_TOKEN,
} = await load();

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

  console.error(response)
};

try {
  await registerCommand({
    name: "hello",
    description: "Test command / Test if bot is alive",
    options: [{
      name: "name",
      description: "The name of the person",
      type: 3,
      required: true,
    }],
  });

  await registerCommand({
    name: "playlists",
    description: "Get url to the playlist repository",
    options: [],
  });

  await registerCommand({
    name: "boop-the-geek",
    description: "Boop the very moderatable Geek",
    options: [],
  });
} catch (_) {
  console.error(_);
}
