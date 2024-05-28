import {
  BitFieldResolvable,
  Client,
  GatewayIntentsString,
} from "@/apps/discord-bot/deps.ts";

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
  client.removeAllListeners();
}

export async function useClient<T>(
  intents: BitFieldResolvable<GatewayIntentsString, number>,
  callback: (client: Client) => T,
) {
  try {
    const client = await createClient(intents);
    const result = await callback(client);
    destroyClient(client);
    return result;
  } catch (err) {
    console.error("Error in useClient", err);
  }
}
