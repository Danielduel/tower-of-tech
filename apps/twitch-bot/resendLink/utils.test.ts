import { extractTwitchName } from "@/apps/twitch-bot/resendLink/utils.ts";
import { assertEquals, describe, it } from "@/packages/deps/test.ts";

const channelNames: [string, string][] = [
  ["#danielduel", "danielduel"],
  ["#jonas_0_o", "jonas_0_o"],
];

const atNames: [string, string][] = [
  ["@danielduel", "danielduel"],
  ["@jonas_0_o", "jonas_0_o"],
];

describe("extractTwitchName", () => {
  describe("channel names", () => {
    channelNames.forEach(([given, expect]) => {
      it(`given ${given} expect ${expect}`, () => {
        assertEquals(extractTwitchName(given), expect);
      });
    });
  });

  describe("at names", () => {
    atNames.forEach(([given, expect]) => {
      it(`given ${given} expect ${expect}`, () => {
        assertEquals(extractTwitchName(given), expect);
      });
    });
  });
});
