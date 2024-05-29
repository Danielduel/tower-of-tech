import { getStartAndEndTime } from "@/apps/discord-bot/cron/tech-multi/utils.ts";
import {
  broadcastChannelId,
  eventDescription,
  eventLocation,
  eventTitle,
  getEventNotificationMessage,
  guildId,
} from "@/apps/discord-bot/cron/tech-multi/constants.ts";
import { useBot } from "@/apps/discord-bot/client.ts";
import {
  ChannelTypes,
  createScheduledEvent,
  GatewayIntents,
  getChannel,
  getScheduledEvents,
  ScheduledEventEntityType,
  ScheduledEventPrivacyLevel,
  sendMessage,
} from "@/apps/discord-bot/deps.ts";

export async function createTechMultiEvent() {
  await useBot(
    GatewayIntents.GuildScheduledEvents |
      GatewayIntents.GuildMessages,
    async (bot) => {
      const scheduledEventsAll = await getScheduledEvents(bot, BigInt(guildId));
      const scheduledEvents = scheduledEventsAll.filter((x) =>
        x.name === eventTitle
      );

      if (scheduledEvents.size !== 0) {
        return;
      }

      const eventTimes = getStartAndEndTime();
      const scheduledEvent = await createScheduledEvent(bot, BigInt(guildId), {
        entityType: ScheduledEventEntityType.External,
        location: eventLocation,
        name: eventTitle,
        description: eventDescription,
        privacyLevel: ScheduledEventPrivacyLevel.GuildOnly,
        // image: imageBase64
        scheduledStartTime: eventTimes.scheduledStartTime,
        scheduledEndTime: eventTimes.scheduledEndTime,
      });

      const channel = await getChannel(bot, BigInt(broadcastChannelId));
      if (channel.type === ChannelTypes.GuildText) {
        const startTimeWithoutMilis = Math.floor(
          eventTimes.scheduledStartTime / 1000,
        );
        await sendMessage(
          bot,
          BigInt(broadcastChannelId),
          {
            content: getEventNotificationMessage(
              startTimeWithoutMilis,
              scheduledEvent.id.toString(),
            ),
          },
        );
      }
    },
  );
}
