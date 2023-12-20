import { Client } from "npm:discord.js";
import { findBeatSaverResolvables } from "../../../packages/api-beatsaver/BeatSaverResolvable.ts";
import { fetchAndCacheFromResolvables } from "@/packages/api-beatsaver/mod.ts";

export async function discordChannelHistoryToBeatSaverData (client: Client, guildId: string, channelId: string) {
  const guild = await client.guilds.fetch(guildId);
  const channel = await guild.channels.fetch(channelId);
  if (!channel?.isTextBased()) {
    console.log("Channel is not text based");
    return;
  }

  const messages = await channel.messages.fetch({ limit: 100 });

  const beatSaverResolvables = messages
    .map((m) => findBeatSaverResolvables(m.content))
    .flatMap(x => x.resolvables)
  
  const resolved = await fetchAndCacheFromResolvables(beatSaverResolvables);

  console.log("5")
  return resolved;
};
