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
export const getShortPingReminderMessage = (startTimeWithoutMilis: number) => `
🔋 Doublecheck if everything is charged 👀

${eventTitle} <t:${startTimeWithoutMilis}:R>
`;
export const getLongPingReminderMessage = (startTimeWithoutMilis: number) => `
🪫 Today 🎉

${eventTitle} <t:${startTimeWithoutMilis}:R>
`;