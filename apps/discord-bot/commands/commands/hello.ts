import { GatewayIntentBits } from "https://deno.land/x/discord_api_types@0.37.62/v10.ts";
import { useClient } from "../../client.ts";
import { CommandHelloInteraction } from "../types.ts";
import { respondWithMessage } from "../utils.ts";
import { Message } from "npm:discord.js";
import { BeatSaverApi } from "../../../../packages/api-beatsaver/api.ts";

const resolveUrlBeatSaverMaps = async (url: string) => {
  const id = url.split("https://beatsaver.com/maps/")[1].toUpperCase();
  console.log(id);
  const data = await BeatSaverApi.mapById.get({
    urlParams: {
      id,
    },
  });
  if (data.status >= 200 && data.status < 299) {
    return data.data;
  }
  return null;
};

const resolveUrl = async (url: string) => {
  switch (true) {
    case url.startsWith("https://beatsaver.com/maps/"):
      return await resolveUrlBeatSaverMaps(url);
  }
};

const urlRegex =
  /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/;
const filterAndTransformMessage = async (message: Message) => {
  const urls = message.content.match(urlRegex);
  if (!urls) return;

  const url = urls[0];
  const resolved = await resolveUrl(url);

  return {
    message,
    url,
    resolved,
  };
};

export async function executeHello(commandEvent: CommandHelloInteraction) {
  if (commandEvent.user?.id !== "221718279423655937") return;
  await useClient([
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ], async (client) => {
    const guild = await client.guilds.fetch("689050370840068309");
    const channel = await guild.channels.fetch("1186318031907979314");
    if (!channel?.isTextBased()) return;

    const messages = await channel.messages.fetch({
      limit: 100,
    });
    const messagesWithResolved =
      (await Promise.all(messages.map(filterAndTransformMessage))).filter((x) =>
        !!x
      );
    return respondWithMessage(`I would create a playlist of: \n
    ${
      messagesWithResolved.map((x) => `
    ${x?.resolved?.versions[0].hash}
    (${x?.resolved?.name} mapped by ${x?.resolved?.uploader.name})
    \n`)
    }
    `);
  });
}
