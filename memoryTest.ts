// // // import { discordChannelHistoryToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelHistoryToBeatSaverData.ts";

// import { dbDiscordBot } from "@/packages/database-discord-bot/mod.ts";
// import { discordChannelHistoryToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelHistoryToBeatSaverData.ts";

// // // import { fetchAndCacheFromResolvables } from "@/packages/api-beatsaver/mod.ts";
// // // import { BeatSaverResolvable } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
// // import { discordChannelHistoryToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelHistoryToBeatSaverData.ts";

// // const usages: Deno.MemoryUsage[] = [];
// // let memMax = 0;

// // const inter = setInterval(() => {
// //   const usage = Deno.memoryUsage();
// //   if (usage.heapUsed > memMax) {
// //     memMax = usage.heapUsed;
// //   }
// //   usages.push(usage);
// // }, 4)

// // const data = await discordChannelHistoryToBeatSaverData("689050370840068309", "916959192428986418");
// // console.log(data);
// // // const data = await fetchAndCacheFromResolvables(resolvables);

// // clearInterval(inter);

// // // Deno.writeTextFileSync("usage2.txt", usages.map(x => JSON.stringify(x)).join("\n"));
// // // Deno.writeTextFileSync("data2.txt", JSON.stringify(data));

// // console.log("memMax ", memMax);
// // // 

// // await useClient([GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildScheduledEvents], async (client) => {
// //   const guild = await client.guilds.fetch("689050370840068309");
// //   console.log("Joke ", await getReminderJoke(guild));
// // });

// const guildId = "689050370840068309";
// const channelId = "1176658722563567759";

// const discordChannelData = await dbDiscordBot.DiscordChannel.findFirst({
//   where: {
//     channelId,
//   },
// });
// if (!discordChannelData) {
//   console.log("This channel is not registered (missing config data)", true);
// }
// if (discordChannelData.guildId !== guildId) {
//   console.log("Channel-Guild mismatch error", true);
// }
// if (!discordChannelData.markedAsPlaylist) {
//   console.log(
//     "This channel doesn't support being a playlist",
//     true,
//   );
// }

// const data = await discordChannelHistoryToBeatSaverData(
//   guildId,
//   channelId,
// );

// console.log(data);
