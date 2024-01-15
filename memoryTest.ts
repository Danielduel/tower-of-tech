import { discordChannelToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelToBeatSaverData.ts";

const data = await discordChannelToBeatSaverData(
  "689050370840068309",
  "1186816165083877506",
);

console.log(data);
