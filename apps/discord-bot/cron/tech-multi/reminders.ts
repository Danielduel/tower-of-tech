import { GatewayIntentBits } from "npm:discord.js";
import { useClient } from "@/apps/discord-bot/client.ts";
import { broadcastChannelId, getLongPingReminderMessage, getShortPingReminderMessage, guildId } from "@/apps/discord-bot/cron/tech-multi/constants.ts";
import { getStartAndEndTime } from "@/apps/discord-bot/cron/tech-multi/utils.ts";

export async function longReminder() {
  await useClient([GatewayIntentBits.GuildMessages], async (client) => {
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(broadcastChannelId);

    if (!channel) return;
    if (!channel.isTextBased()) return;

    const eventTimes = getStartAndEndTime();
    const startTimeWithoutMilis = Math.floor(
      eventTimes.scheduledStartTime / 1000,
    );

    await channel.send(getLongPingReminderMessage(startTimeWithoutMilis));
  });
}

export async function shortReminder() {
  await useClient([GatewayIntentBits.GuildMessages], async (client) => {
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(broadcastChannelId);

    if (!channel) return;
    if (!channel.isTextBased()) return;

    const eventTimes = getStartAndEndTime();
    const startTimeWithoutMilis = Math.floor(
      eventTimes.scheduledStartTime / 1000,
    );

    await channel.send(getShortPingReminderMessage(startTimeWithoutMilis));
  });
}
