import { assertEquals, describe, it } from "../../../deps/test.ts";
import { HOUR_MS } from "@/packages/utils/time.ts";
import { getTimezoneOffsetMs } from "@/packages/discord/cron/tech-multi/utils.ts";

describe("getTimezoneOffsetMs", () => {
  type Given = [string | undefined, string];
  type Expect = number;

  const tests: [string, Given, Expect][] = [
    [
      "Winter Time with default of Europe/Warsaw should result in +1h",
      [undefined, "1 January 2024"],
      1 * HOUR_MS,
    ],
    [
      "Summer Time with default of Europe/Warsaw should result in +2h",
      [undefined, "1 August 2024"],
      2 * HOUR_MS,
    ],
    [
      "Winter Time with Europe/Warsaw should result in +1h",
      ["Europe/Warsaw", "1 January 2024"],
      1 * HOUR_MS,
    ],
    [
      "Summer Time Europe/Warsaw should result in +2h",
      ["Europe/Warsaw", "1 August 2024"],
      2 * HOUR_MS,
    ],
    [
      "Winter Time with Europe/London should result in 0h",
      ["Europe/London", "1 January 2024"],
      0 * HOUR_MS,
    ],
    [
      "Summer Time with Europe/London should result in +1h",
      ["Europe/London", "1 August 2024"],
      1 * HOUR_MS,
    ],
    [
      "Winter Time with America/New_York should result in -4h",
      ["America/New_York", "1 January 2024"],
      -5 * HOUR_MS,
    ],
    [
      "Summer Time with America/New_York should result in -5h",
      ["America/New_York", "1 August 2024"],
      -4 * HOUR_MS,
    ],
  ];

  tests.forEach(([name, [givenTimezone, givenDate], expect]) => {
    it(name, () => {
      assertEquals(getTimezoneOffsetMs(new Date(givenDate).getTime(), givenTimezone), expect);
    });
  });
});
