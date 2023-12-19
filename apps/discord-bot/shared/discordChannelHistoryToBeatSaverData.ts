import { Client } from "npm:discord.js";
import { findAndResolveUrlsToBeatSaverData } from "@/packages/community/findAndResolveUrlsToBeatSaverData.ts";

export async function discordChannelHistoryToBeatSaverData (client: Client, guildId: string, channelId: string) {
  const guild = await client.guilds.fetch(guildId);
  const channel = await guild.channels.fetch(channelId);
  if (!channel?.isTextBased()) {
    console.log("Channel is not text based");
    return;
  }

  const messages = await channel.messages.fetch({
    limit: 100,
  });
  const messagesWithResolved = (await Promise.all(messages.map((m) =>
    findAndResolveUrlsToBeatSaverData(m.content)
  ))).filter((x) =>
    !!x.beatSaverData
  );

  return messagesWithResolved;
};
