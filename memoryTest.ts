import { discordChannelToBeatSaverData } from "@/packages/discord/shared/discordChannelToBeatSaverData.ts";

const data = await discordChannelToBeatSaverData(
  "689050370840068309",
  "1186991221084790795",
);

console.log(data);

// await runWorkerBody({
//   body: [makeLowercaseMapHash("5289d710242e56075468d1635c74384bb6b4852f")],
//   for: "api-beatsaver-cache-worker",
// });
