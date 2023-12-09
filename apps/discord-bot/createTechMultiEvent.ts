import {
  Client,
  GatewayIntentBits,
  GuildScheduledEventEntityType,
} from "npm:discord.js";

function getStartAndEndTime() {
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;
  const weekMs = dayMs * 7;
  const nowMs = Date.now();
  const lastThursday0Ms = nowMs - (nowMs % weekMs);
  const nextThursday0Ms = lastThursday0Ms + 7 * dayMs;
  const timezoneOffset = +(Intl
    .DateTimeFormat(
      [],
      { timeZone: "Europe/Warsaw", timeZoneName: "short" },
    )
    .formatToParts(0)
    .find((part) => part.type === "timeZoneName") ?? { value: "GMT+1" })
    .value
    .split("+")[1];
  const timezonedNextThursday0Ms = nextThursday0Ms + timezoneOffset * hourMs;
  const scheduledStartTime = timezonedNextThursday0Ms + 20 * hourMs;
  const scheduledEndTime = timezonedNextThursday0Ms + 22 * hourMs;
  return {
    scheduledStartTime,
    scheduledEndTime,
  } as const;
} 

const eventTitle = `Tech multi`;
const eventDescription = `## Brief summary

We will kick off the multi with beginner-friendly things.
Then we will transition between 1st and 2nd hour with middle-level stuff.
We will top that all off with maps that most of us prefer to see only via thick layer of twitch magic.

## First time here?

We use a mod called Multiplayer+ which is available for PCVR and standalone Quest users.
Usefull links:
* [More on joining](https://posts.dduel.dev/danielduel/tech-multi)
* [Playlists used for most of maps during this multi](https://github.com/Danielduel/tower-of-tech/releases/)

## Inviting, Sharing, Streaming

Everybody is very welcome to invite others, share, create own voice chat groups, stream it,
create own subcommunities and listen to the main voice chat that is hosted on Danielduel's discord server.
For safety reasons not everybody is allowed to speak on the main voice chat by default.
`;

export async function createTechMultiEvent() {
  const client = new Client({
    intents: [ GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildMessages,  ]
  });
  const DISCORD_TOT_BOT_TOKEN = Deno.env.get("DISCORD_TOT_BOT_TOKEN")!;
  await client.login(DISCORD_TOT_BOT_TOKEN)
  const guildId = "689050370840068309";
  const broadcastChannelId = "1108645502028894218";
  const guild = await client.guilds.fetch(guildId);
  const scheduledEvents = await guild.scheduledEvents.fetch();

  if (scheduledEvents.size !== 0) {
    await client.destroy();
    await client.removeAllListeners();
    return
  };

  const eventTimes = getStartAndEndTime();
  const scheduledEvent = await guild.scheduledEvents.create({
    entityType: GuildScheduledEventEntityType.External,
    entityMetadata: {
      location: "Multiplayer+",
    },
    name: eventTitle,
    description: eventDescription,
    privacyLevel: 2, // guild-only
    // image: imageBase64
    ...eventTimes,
  });

  const channel = await guild.channels.fetch(broadcastChannelId);
  if (channel?.isTextBased()) {
    channel.send(`
${eventTitle} in <t:${eventTimes.scheduledStartTime}:R>

<@&1111286344837247107>
<@&1111286551494799530>
<@&1111286596721979462>

https://discord.gg/EnY69jk2cg?event=${scheduledEvent.id}
    `);
  }

  await client.destroy();
  await client.removeAllListeners();
}
