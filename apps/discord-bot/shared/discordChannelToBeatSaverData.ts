import {
  Channel,
  ChannelTypes,
  Collection,
  GatewayIntents,
  getChannels,
  getGuild,
  getMessages,
  Message,
} from "@/apps/discord-bot/deps.ts";
import { findBeatSaverResolvables } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { useBot } from "@/apps/discord-bot/client.ts";
import { createClient } from "@/packages/trpc/trpc-editor.ts";
import { filterNulls } from "@/packages/utils/filter.ts";

// const forumChannelToResolvables = async (channel: ThreadOnlyChannel) => {
//   const threads = await channel.threads.fetch();
//   const messages = await Promise.all(
//     threads.threads.map((thread) => thread.fetchStarterMessage()),
//   );

//   return messages
//     .filter(filterNulls)
//     .map((m) => findBeatSaverResolvables(m.content))
//     .flatMap((x) => x.resolvables);
// };

// const textChannelToResolvables = async (
//   channel: Channel,
// ) => {
//   return messages
//     .map((m) => findBeatSaverResolvables(m.content))
//     .flatMap((x) => x.resolvables);
// };

export function discordChannelHistoryToBeatSaverResolvables(
  messages: Collection<bigint, Message>,
) {
  try {
    // if (!channel) {
    //   console.log("Channel doesn't exist");
    //   return;
    // }

    // if (channel.type === ChannelTypes.GuildText) {
    //   return await textChannelToResolvables(channel);
    // }

    // if (channel.type === ChannelTypes.GuildForum) {
    //   return await forumChannelToResolvables(channel);
    // }

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
      // const guild = await client.guilds.fetch(guildId);
      const channel = guild.channels.get(BigInt(channelId));
      // const channel = await guild.channels.fetch(channelId);

      if (!channel) return;

      const messages = await getMessages(bot, channel.id);
      // const guildDetails = await guild.fetch();

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
