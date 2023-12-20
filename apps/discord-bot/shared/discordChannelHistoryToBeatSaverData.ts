import { Client, TextBasedChannel } from "npm:discord.js";
import { findBeatSaverResolvables } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { fetchAndCacheFromResolvables } from "@/packages/api-beatsaver/mod.ts";
import { useClient } from "@/apps/discord-bot/client.ts";
import { GatewayIntentBits } from "https://deno.land/x/discord_api_types@0.37.62/v10.ts";
import { createClient } from "@/packages/trpc/trpc-editor.ts";

const channelToResolvables = async (channel: TextBasedChannel) => {
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
  if (!channel.isTextBased()) {
    console.log("Channel is not text based");
    return;
  }

  const beatSaverResolvables = await channelToResolvables(channel);

  return beatSaverResolvables;
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
