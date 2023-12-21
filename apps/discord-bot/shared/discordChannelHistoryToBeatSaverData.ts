import { Client, TextBasedChannel, ThreadOnlyChannel } from "npm:discord.js";
import { findBeatSaverResolvables } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { useClient } from "@/apps/discord-bot/client.ts";
import { GatewayIntentBits } from "https://deno.land/x/discord_api_types@0.37.62/v10.ts";
import { createClient } from "@/packages/trpc/trpc-editor.ts";
import { filterNulls } from "@/packages/utils/filter.ts";

const forumChannelToResolvables = async (channel: ThreadOnlyChannel) => {
  const threads = await channel.threads.fetch();
  const messages = await Promise.all(threads.threads.map(thread => thread.fetchStarterMessage()));
  
  return messages
    .filter(filterNulls)
    .map((m) => findBeatSaverResolvables(m.content))
    .flatMap((x) => x.resolvables);
}

const textChannelToResolvables = async (channel: TextBasedChannel) => {
  const messages = await channel.messages.fetch({ limit: 100 });

  return messages
    .map((m) => findBeatSaverResolvables(m.content))
    .flatMap((x) => x.resolvables);
};

export async function discordChannelHistoryToBeatSaverResolvables(
  client: Client,
  guildId: string,
  channelId: string,
) {
  const guild = await client.guilds.fetch(guildId);
  const channel = await guild.channels.fetch(channelId);
  if (!channel) {
    console.log("Channel doesn't exist");
    return;
  }

  if (channel.isTextBased()) {
    return await textChannelToResolvables(channel);
  }

  if (channel.isThreadOnly()) {
    return await forumChannelToResolvables(channel);
  }

  console.log("Channel is not text based");
  return;
}

export async function discordChannelHistoryToBeatSaverData(
  guildId: string,
  channelId: string,
) {
  const beatSaverResolvables = await useClient([
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ], async (client) => {
    return await discordChannelHistoryToBeatSaverResolvables(
      client,
      guildId,
      channelId,
    );
  });
  
  if (!beatSaverResolvables) return null;

  const client = createClient(false);
  
  const resolved = await client.map.fromBeatSaverResolvables.query({ beatSaverResolvables });

  return resolved;
}
