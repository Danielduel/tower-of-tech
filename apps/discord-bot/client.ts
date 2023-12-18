import {
  BitFieldResolvable,
  Client,
  GatewayIntentsString,
} from "npm:discord.js";

async function createClient(
  intents: BitFieldResolvable<GatewayIntentsString, number>,
) {
  const client = new Client({
    intents,
  });
  const DISCORD_TOT_BOT_TOKEN = Deno.env.get("DISCORD_TOT_BOT_TOKEN")!;
  await client.login(DISCORD_TOT_BOT_TOKEN);
  return client;
}

async function destroyClient(client: Client) {
  await client.destroy();
  await client.removeAllListeners();
}

export async function useClient(
  intents: BitFieldResolvable<GatewayIntentsString, number>,
  callback: (client: Client) => void,
) {
  const client = await createClient(intents);
  const result = await callback(client);
  await destroyClient(client);
  return result;
}
