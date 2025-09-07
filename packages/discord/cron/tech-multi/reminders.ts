import {
  ChannelTypes,
  GatewayIntents,
  getChannel,
  getGuild,
  getScheduledEventUsers,
  sendMessage,
} from "@/packages/discord/deps.ts";
import { useBot } from "@/packages/discord/client.ts";
import {
  broadcastChannelId,
  getLongPingReminderMessage,
  getShortPingReminderMessage,
  guildId,
  jokeChannelId,
  techMultiGptPrompt,
} from "@/packages/discord/cron/tech-multi/constants.ts";
import { getStartAndEndTimeOfScheduledEventCurrentWeek } from "@/packages/discord/cron/tech-multi/utils.ts";
import { handleFail, reportFail } from "@/packages/utils/handleFail.ts";
// import { Bot } from "@/packages/discord/deps.ts";
// import { getScheduledEvents } from "@/packages/discord/deps.ts";
// import { OpenAI } from "@/packages/deps/OpenAI.ts";
//
// export async function getTechMultiGptPrompt(
//   taskDefinition: string,
//   wordLength: number,
//   bot: Bot,
//   guildId: string,
// ) {
//   const openai = new OpenAI({
//     apiKey: Deno.env.get("OPENAI_API_KEY"),
//   });
//   const events = await getScheduledEvents(bot, BigInt(guildId));
//   const firstEvent = events.first();
//
//   if (!firstEvent) return "";
//
//   const participants = await getScheduledEventUsers(
//     bot,
//     BigInt(guildId),
//     firstEvent.id,
//   );
//   const participantsNames = participants.map((x) => x.username);
//
//   const completion = await openai.chat.completions.create({
//     model: "gpt-4o-mini",
//     messages: [{
//       role: "user",
//       content: techMultiGptPrompt(
//         taskDefinition,
//         wordLength,
//         participantsNames,
//       ),
//     }],
//   });
//
//   return completion.choices[0].message.content;
// }
//
// export async function getReminderJoke(bot: Bot, guildId: string) {
//   return await getTechMultiGptPrompt(
//     "Pick a random participant. Tell a joke.",
//     40,
//     bot,
//     guildId,
//   );
// }
//
// export async function getInvitation(bot: Bot, guildId: string) {
//   return await getTechMultiGptPrompt(
//     "Create an invitation for this event.",
//     40,
//     bot,
//     guildId,
//   );
// }
//
// export async function getShortElevatorPitch(bot: Bot, guildId: string) {
//   return await getTechMultiGptPrompt(
//     "Write a short elevator pitch to another Beat Saber player that doesn't know about the event.",
//     50,
//     bot,
//     guildId,
//   );
// }

export async function techMultiLongReminder() {
  await useBot(
    GatewayIntents.GuildMessages |
      GatewayIntents.GuildScheduledEvents,
    async (bot) => {
      const channel = await getChannel(bot, BigInt(broadcastChannelId));

      if (!channel) return;
      if (channel.type !== ChannelTypes.GuildText) return;

      const joke = ""; // await getReminderJoke(bot, guildId);

      const eventTimes = getStartAndEndTimeOfScheduledEventCurrentWeek();
      const startTimeWithoutMilis = Math.floor(
        eventTimes.scheduledStartTime / 1000,
      );

      await sendMessage(
        bot,
        BigInt(broadcastChannelId),
        {
          content: getLongPingReminderMessage(
            startTimeWithoutMilis,
            joke ?? "",
          ),
        },
      );
    },
  );
}

export async function techMultiShortReminder() {
  await useBot(GatewayIntents.GuildMessages, async (bot) => {
    const guild = await getGuild(bot, BigInt(guildId));
    const channel = await getChannel(bot, BigInt(broadcastChannelId));

    if (!channel) return;
    if (channel.type !== ChannelTypes.GuildText) return;

    const joke = ""; // await getReminderJoke(bot, guildId);

    const eventTimes = getStartAndEndTimeOfScheduledEventCurrentWeek();
    const startTimeWithoutMilis = Math.floor(
      eventTimes.scheduledStartTime / 1000,
    );

    await sendMessage(
      bot,
      BigInt(broadcastChannelId),
      {
        content: getShortPingReminderMessage(startTimeWithoutMilis, joke ?? ""),
      },
    );
  });
}

// export async function techMultiJoke() {
//   await useBot(GatewayIntents.GuildMessages, async (bot) => {
//     const channel = await getChannel(bot, BigInt(jokeChannelId));
//
//     if (!channel) return;
//     if (channel.type !== ChannelTypes.GuildText) return;
//
//     const joke = "" // await getReminderJoke(bot, guildId);
//
//     if (!joke) return;
//
//     await handleFail({
//       throwableFunction: async () => {
//         await sendMessage(bot, BigInt(jokeChannelId), {
//           content: joke,
//         });
//       },
//       handleCatch: reportFail,
//     });
//   });
// }
