import {
  _createBot,
  Bot,
  GatewayIntents,
  startBot,
} from "@/packages/discord/deps.ts";

function createBot(
  intents: GatewayIntents,
) {
  const DISCORD_TOT_BOT_TOKEN = Deno.env.get("DISCORD_TOT_BOT_TOKEN")!;
  console.log("Connecting!");

  return new Promise<{ bot: Bot }>((resolve) => {
    const _bot = _createBot({
      token: DISCORD_TOT_BOT_TOKEN,
      intents,
      events: {
        ready(bot) {
          console.log("Connected!");
          resolve({ bot });
        },
      },
    });

    startBot(_bot);
  });
}

// async function destroyClient(client: Client) {
//   await client.destroy();
//   client.removeAllListeners();
// }
async function destroyBot(bot: Bot) {
  // await bot.ddestroy();
  // bot.events.remove
  // client.removeAllListeners();
}

// export async function useClient<T>(
//   intents: GatewayIntents,
//   callback: (client: Bot) => T,
// ) {
//   try {
//     const bot = createBot(intents);

//     let result;
//     try {
//       result = await callback(client);
//     } catch (err) {
//       console.error("Error in useClient callback", err);
//     }

//     destroyClient(client);
//     return result;
//   } catch (err) {
//     console.error("Error in useClient", err);
//   }
// }

export async function useBot<T>(
  intents: GatewayIntents,
  callback: (bot: Bot) => T,
) {
  try {
    const { bot } = await createBot(intents);

    let result;
    try {
      result = await callback(bot);
    } catch (err) {
      console.error("Error in useBot callback", err);
    }

    return result;
  } catch (err) {
    console.error("Error in useBot", err);
  }
}
