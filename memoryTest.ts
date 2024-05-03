// import { discordChannelToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelToBeatSaverData.ts";

import { runWorkerBody } from "@/packages/api-beatsaver/cache.ts";
import { makeLowercaseMapHash } from "@/packages/types/brands.ts";

// const data = await discordChannelToBeatSaverData(
//   "689050370840068309",
//   "1186816165083877506",
// );

// console.log(data);

await runWorkerBody({
  body: [makeLowercaseMapHash("5289d710242e56075468d1635c74384bb6b4852f")],
  for: "api-beatsaver-cache-worker",
});
