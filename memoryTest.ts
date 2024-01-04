// // // // import { discordChannelHistoryToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelHistoryToBeatSaverData.ts";

// import { GatewayIntentBits } from "npm:discord.js";
// import { useClient } from "@/apps/discord-bot/client.ts";
// import { getInvitation, getReminderJoke, getShortElevatorPitch, getTechMultiGptPrompt } from "@/apps/discord-bot/cron/tech-multi/reminders.ts";

// // import { dbDiscordBot } from "@/packages/database-discord-bot/mod.ts";
// // import { discordChannelHistoryToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelHistoryToBeatSaverData.ts";

// // // // import { fetchAndCacheFromResolvables } from "@/packages/api-beatsaver/mod.ts";
// // // // import { BeatSaverResolvable } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
// // // import { discordChannelHistoryToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelHistoryToBeatSaverData.ts";

// // // const usages: Deno.MemoryUsage[] = [];
// // // let memMax = 0;

// // // const inter = setInterval(() => {
// // //   const usage = Deno.memoryUsage();
// // //   if (usage.heapUsed > memMax) {
// // //     memMax = usage.heapUsed;
// // //   }
// // //   usages.push(usage);
// // }, 4)

// // // const data = await discordChannelHistoryToBeatSaverData("689050370840068309", "916959192428986418");
// // // console.log(data);
// // // // const data = await fetchAndCacheFromResolvables(resolvables);

// // // clearInterval(inter);

// // // // Deno.writeTextFileSync("usage2.txt", usages.map(x => JSON.stringify(x)).join("\n"));
// // // // Deno.writeTextFileSync("data2.txt", JSON.stringify(data));

// // // console.log("memMax ", memMax);
// // // // 

// await useClient([GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildScheduledEvents], async (client) => {
//   const guild = await client.guilds.fetch("689050370840068309");
//   console.log(await getShortElevatorPitch(guild));
// });



