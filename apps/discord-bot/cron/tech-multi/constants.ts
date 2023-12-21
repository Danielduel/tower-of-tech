export const guildId = "689050370840068309";
export const broadcastChannelId = "1108645502028894218";
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
* [Playlists used for most of maps during this multi](https://github.com/Danielduel/tower-of-tech/releases/)

## Inviting, Sharing, Streaming

Everybody is very welcome to invite others, share, create own voice chat groups, stream it,
create own subcommunities and listen to the main voice chat that is hosted on Danielduel's discord server.
For safety reasons not everybody is allowed to speak on the main voice chat by default.
`;
export const getEventNotificationMessage = (startTimeWithoutMilis: number, eventId: string) => `
${eventTitle} <t:${startTimeWithoutMilis}:R>

<@&1111286344837247107>
<@&1111286551494799530>
<@&1111286596721979462>

https://discord.gg/EnY69jk2cg?event=${eventId}
`;
export const getShortPingReminderMessage = (startTimeWithoutMilis: number, joke: string) => `
🔋 Doublecheck if everything is charged 👀

${joke}

<@&1169696864111689910>

${eventTitle} <t:${startTimeWithoutMilis}:R>
`;
export const getLongPingReminderMessage = (startTimeWithoutMilis: number, joke: string) => `
🪫 Today 🎉

${joke}

<@&1169696932638236777>

${eventTitle} <t:${startTimeWithoutMilis}:R>
`;
export const reminderJokeGptPrompt = (participantsNames: string[]) => `
You are an organizer of Beat Saber multiplayer session that happens weekly.
The session happens online, we don't meet eachother in person.
This event starts with more beginner friendly songs and end up with hard ones.
We refer to beatsaber notes as bloq, block.
We refer to cutting as slicing, booping, swinging, hitting, bonking.
Bad cuts can be: too late, too early, too complicated, too linear, too fast, underswing, miss, bad cut.
Good cuts can be: flowy, perfect, 115, comfy, technical.
We refer to main skills as: reading notes, hitting notes, wristrolls, keeping flow, keeping tempo.
We don't treat ranked maps seriously, we love technical and complicated maps.
Don't refer to rhythm.
List of participants: \n${participantsNames.join("\n* ")}.
Danielduel is an organizer.
Pick a random participant or participants for the answer.
Aside of everything else you could joke about participants being too late, participants missing blocks.
Participants are representing wide skill range, rather don't joke about somebody being better that somebody else.
Tell a joke that will be used on an invitation card.
Answer should be less than 40 words.
`;
