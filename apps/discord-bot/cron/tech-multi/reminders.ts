import OpenAI from "npm:openai@4";
import { Guild, GatewayIntentBits } from "npm:discord.js";
import { useClient } from "@/apps/discord-bot/client.ts";
import { broadcastChannelId, getLongPingReminderMessage, getShortPingReminderMessage, guildId, jokeChannelId, reminderJokeGptPrompt } from "@/apps/discord-bot/cron/tech-multi/constants.ts";
import { getStartAndEndTimeToday } from "@/apps/discord-bot/cron/tech-multi/utils.ts";

export async function getReminderJoke (guild: Guild) {
  const openai = new OpenAI({
    apiKey: Deno.env.get("OPENAI_API_KEY")
  });

  const events = await guild.scheduledEvents.fetch();
  const participants = await events.at(0)?.fetchSubscribers();
  const participantsNames = participants?.map(x => x.user.username)!;

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: reminderJokeGptPrompt(participantsNames) }],
  });

  return completion.choices[0].message.content;
}

export async function techMultiLongReminder() {
  await useClient([GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildScheduledEvents], async (client) => {
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(broadcastChannelId);

    if (!channel) return;
    if (!channel.isTextBased()) return;

    const joke = await getReminderJoke(guild);

    const eventTimes = getStartAndEndTimeToday();
    const startTimeWithoutMilis = Math.floor(
      eventTimes.scheduledStartTime / 1000,
    );

    await channel.send(getLongPingReminderMessage(startTimeWithoutMilis, joke ?? ""));
  });
}

export async function techMultiShortReminder() {
  await useClient([GatewayIntentBits.GuildMessages], async (client) => {
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(broadcastChannelId);

    if (!channel) return;
    if (!channel.isTextBased()) return;

    const joke = await getReminderJoke(guild);

    const eventTimes = getStartAndEndTimeToday();
    const startTimeWithoutMilis = Math.floor(
      eventTimes.scheduledStartTime / 1000,
    );

    await channel.send(getShortPingReminderMessage(startTimeWithoutMilis, joke ?? ""));
  });
}

export async function techMultiJoke() {
  await useClient([GatewayIntentBits.GuildMessages], async (client) => {
    const guild = await client.guilds.fetch(guildId);
    const channel = await guild.channels.fetch(jokeChannelId);

    if (!channel) return;
    if (!channel.isTextBased()) return;

    const joke = await getReminderJoke(guild);

    if (!joke) return;

    const message = await channel.send(joke);
    await Promise.all([
      message.react(":clown:"),
      message.react(":boop:"),
      message.react(":thinking:"),
      message.react(":snickers:")
    ]);
  });
}
