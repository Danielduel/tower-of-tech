import {
  GatewayIntentBits,
  GuildScheduledEventEntityType,
} from "npm:discord.js";
import { getStartAndEndTime } from "./utils.ts";
import {
  broadcastChannelId,
  eventDescription,
  eventLocation,
  eventTitle,
  getEventNotificationMessage,
  guildId,
} from "./constants.ts";
import { useClient } from "@/apps/discord-bot/client.ts";

export async function createTechMultiEvent() {
  await useClient([
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildMessages,
  ], async (client) => {
    const guild = await client.guilds.fetch(guildId);
    const scheduledEvents = await guild.scheduledEvents.fetch();

    if (scheduledEvents.size !== 0) {
      return;
    }

    const eventTimes = getStartAndEndTime();
    const scheduledEvent = await guild.scheduledEvents.create({
      entityType: GuildScheduledEventEntityType.External,
      entityMetadata: {
        location: eventLocation,
      },
      name: eventTitle,
      description: eventDescription,
      privacyLevel: 2, // guild-only
      // image: imageBase64
      ...eventTimes,
    });

    const channel = await guild.channels.fetch(broadcastChannelId);
    if (channel?.isTextBased()) {
      const startTimeWithoutMilis = Math.floor(
        eventTimes.scheduledStartTime / 1000,
      );
      await channel.send(
        getEventNotificationMessage(startTimeWithoutMilis, scheduledEvent.id),
      );
    }
  });
}
