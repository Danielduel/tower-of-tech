import { towerOfTechWebsiteOrigin } from "@/packages/utils/constants.ts";

export const guildId = "689050370840068309";
export const broadcastChannelId = "1108645502028894218";
export const jokeChannelId = "1076069539613249536";
export const eventTitle = `Tech multi`;
export const eventLocation = "Multiplayer+";
export const eventDescription = `
## Brief summary

We will kick off the multi with beginner-friendly things.
Then we will transition between 1st and 2nd hour with middle-level stuff.
We will top that all off with maps that most of us prefer to see only via thick layer of twitch magic.

## First time here?

We use a mod called Multiplayer+ which is available for PCVR and standalone Quest users.
Usefull links:
* [More on joining](https://posts.dduel.dev/danielduel/tech-multi)
* [Playlists used for most of maps during this multi, with an installation guide](${towerOfTechWebsiteOrigin})

## Inviting, Sharing, Streaming

Everybody is very welcome to invite others, share, create own voice chat groups, stream it,
create own subcommunities and listen to the main voice chat that is hosted on Danielduel's discord server.
For safety reasons not everybody is allowed to speak on the main voice chat by default.
`;
export const getEventNotificationMessage = (
  startTimeWithoutMilis: number,
  eventId: string,
) => `
${eventTitle} <t:${startTimeWithoutMilis}:R>

<@&1111286344837247107>
<@&1111286551494799530>
<@&1111286596721979462>

https://discord.gg/EnY69jk2cg?event=${eventId}
`;
export const getShortPingReminderMessage = (
  startTimeWithoutMilis: number,
  joke: string,
) => `
🔋 Doublecheck if everything is charged 👀

${joke}

<@&1169696864111689910>

${eventTitle} <t:${startTimeWithoutMilis}:R>
`;
export const getLongPingReminderMessage = (
  startTimeWithoutMilis: number,
  joke: string,
) => `
🪫 Today 🎉

${joke}

<@&1169696932638236777>

${eventTitle} <t:${startTimeWithoutMilis}:R>
`;
export const techMultiGptPrompt = (
  taskDefinition: string,
  wordLength: number,
  participantsNames: string[],
) => `
You are an organizer of Beat Saber multiplayer session that happens weekly at Thursdays.
The session happens online, we don't meet eachother in person.
This event starts with more beginner friendly songs and end up with hard ones.

Beat Saber is a music virtual reality game about hitting notes, dodging and crouching walls, enjoying lightshows.

In Beat Saber weaker players use pauses during single player sessions to rest.
We refer to Beat Saber notes as one of bloq, block.
We refer to hits as one of slicing, booping, swinging, hitting, bonking.
Bad hits can be one of too late, too early, too complicated, too linear, too fast, underswing, miss, bad cut.
Good hits can be one of flowy, perfect, 115, comfy, technical.
We refer to main skills as one of reading notes, hitting notes, keeping flow, keeping tempo.
We don't treat ranked maps seriously, we love technical and complicated maps.

List of participants: \n${participantsNames.join("\n* ")}.
Danielduel is an organizer.

Don't refer to ranked maps as games or matches.
Don't refer to Beat Saber battlefield, kitchen, "hide and seek", "that guy", swinging the saber into a wall, way to victory, headset flying off, bringing down the walls, rhythm.
Don't use words: dice, rogue, pesky.
Participants are representing wide skill range, don't do comparisions.

${taskDefinition}
Joke should be less than ${wordLength} words.
Don't wrap answer in quotes.
`;
