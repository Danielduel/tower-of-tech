import {
  Collection,
  GatewayIntents,
  getChannel,
  getGuild,
  getMessages,
  Message,
} from "@/packages/discord/deps.ts";
import { findBeatSaverResolvables } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { useBot } from "@/packages/discord/client.ts";
import { fetchAndCacheFromResolvables } from "@/packages/api-beatsaver/mod.ts";

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
      const channel = await getChannel(bot, BigInt(channelId));

      if (!channel) throw "Invalid channel";

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
      } as const;
    },
  );

  if (!data) throw "No data";
  if (!data.resolvables) throw "No resolvables";

  const resolved = await fetchAndCacheFromResolvables(data.resolvables);

  return {
    guildName: data.guildName,
    channelName: data.channelName,
    resolved,
  };
}
