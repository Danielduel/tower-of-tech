import {
  Collection,
  GatewayIntents,
  getGuild,
  getMessages,
  Message,
} from "@/apps/discord-bot/deps.ts";
import { findBeatSaverResolvables } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { useBot } from "@/apps/discord-bot/client.ts";
import { createClient } from "@/packages/trpc/trpc-editor.ts";

export function discordChannelHistoryToBeatSaverResolvables(
  messages: Collection<bigint, Message>,
) {
  try {
    return messages
      .map((m) => findBeatSaverResolvables(m.content))
      .flatMap((x) => x.resolvables);
  } catch (err) {
    console.error(`error in discordChannelHistoryToBeatSaverResolvables`, err);
  }
}

export async function discordChannelToBeatSaverData(
  guildId: string,
  channelId: string,
) {
  const data = await useBot(
    GatewayIntents.MessageContent |
      GatewayIntents.GuildMessages |
      GatewayIntents.Guilds,
    async (bot) => {
      const guild = await getGuild(bot, BigInt(guildId));
      const channel = guild.channels.get(BigInt(channelId));

      if (!channel) return;

      const messages = await getMessages(bot, channel.id);
      console.log(
        `discordChannelToBeatSaverData: Got ${messages.size} messages`,
      );

      return {
        guildName: guild.name,
        channelName: channel.name,
        resolvables: discordChannelHistoryToBeatSaverResolvables(
          messages,
        ),
      };
    },
  );

  if (!data) return null;
  if (!data.resolvables) return null;

  const client = createClient(false);

  const resolved = await client.map.fromBeatSaverResolvables.query({
    beatSaverResolvables: data.resolvables,
  });

  return {
    guildName: data.guildName,
    channelName: data.channelName,
    resolved,
  };
}
