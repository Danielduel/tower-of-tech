import { assertEquals } from "@/packages/deps/test.ts";
import { extractBeatLeaderProfileIdFromTwitchChatResponse } from "@/packages/api-beatleader/extractBeatLeaderProfileId.ts";

[
  [
    "! @Danielduel You can find the streamer's ScoreSaber Profile at https://scoresaber.com/u/76561199792344379 BeatLeader Profile at https://www.beatleader.xyz/u/76561199792344379",
    "76561199792344379",
  ],
  [
    "! @Danielduel You can find the streamer's ScoreSaber Profile at https://scoresaber.com/u/76561198351485033 BeatLeader Profile at https://www.beatleader.xyz/u/76561198351485033",
    "76561198351485033",
  ],
  [
    "! @Danielduel You can find the streamer's ScoreSaber Profile at https://scoresaber.com/u/76561197995831022 BeatLeader Profile at https://www.beatleader.xyz/u/76561197995831022",
    "76561197995831022",
  ],
  [
    "! @Danielduel You can find the streamer's ScoreSaber Profile at https://scoresaber.com/u/76561198027274310 BeatLeader Profile at https://www.beatleader.xyz/u/76561198027274310",
    "76561198027274310",
  ],
  [
    "! @Danielduel You can find the streamer's ScoreSaber Profile at https://scoresaber.com/u/76561198850017179 BeatLeader Profile at https://www.beatleader.xyz/u/76561198850017179",
    "76561198850017179",
  ],
].forEach(([param, expected]) => {
  Deno.test(`extractBeatLeaderProfileIdFromTwitchChatResponse given "${param}" expect "${expected}"`, () => {
    assertEquals(extractBeatLeaderProfileIdFromTwitchChatResponse(param), expected);
  });
});
