import { Client, TextBasedChannel } from "npm:discord.js/";
import { findBeatSaverResolvables } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { fetchAndCacheFromResolvables } from "@/packages/api-beatsaver/mod.ts";

const channelToResolvables = async (channel: TextBasedChannel) => {
  const messages = await channel.messages.fetch({ limit: 100 });

  return messages
    .map((m) => findBeatSaverResolvables(m.content))
    .flatMap(x => x.resolvables);
}

export async function discordChannelHistoryToBeatSaverData (client: Client, guildId: string, channelId: string) {
  const guild = await client.guilds.fetch(guildId);
  const channel = await guild.channels.fetch(channelId);
  if (!channel?.isTextBased()) {
    console.log("Channel is not text based");
    return;
  }

  const beatSaverResolvables = await channelToResolvables(channel);
  
  console.log("0")
  const resolved = await fetchAndCacheFromResolvables(beatSaverResolvables);
  console.log("post 0")
  return resolved;
};
