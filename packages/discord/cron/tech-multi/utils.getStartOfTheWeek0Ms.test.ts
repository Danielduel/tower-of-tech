import { assertEquals, describe, it } from "../../../deps/test.ts";
import { getStartOfTheWeek0Ms } from "@/packages/discord/cron/tech-multi/utils.ts";

describe("getStartOfTheWeek0Ms", () => {
  type Given = string;
  type Expect = string;

  const tests: [string, Given, Expect][] = [
    // ["0ms", "Thu Jan 01 1970 00:00:00 GMT+0000", "Mon Dec 29 1969 00:00:00 GMT+0000"],
    ...(Array(25).fill(0).map((_, i) =>
      [
        `Monday ${`${i}`.padStart(2, "0")}:00:00`,
        `Mon Sep 16 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 16 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    ...(Array(25).fill(0).map((_, i) =>
      [
        `Tuesday ${`${i}`.padStart(2, "0")}:00:00`,
        `Tue Sep 17 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 16 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),

    ...(Array(25).fill(0).map((_, i) =>
      [
        `Wednesday ${`${i}`.padStart(2, "0")}:00:00`,
        `Wed Sep 18 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 16 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    ...(Array(25).fill(0).map((_, i) =>
      [
        `Thursday ${`${i}`.padStart(2, "0")}:00:00`,
        `Thu Sep 19 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 16 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    ...(Array(25).fill(0).map((_, i) =>
      [
        `Friday ${`${i}`.padStart(2, "0")}:00:00`,
        `Fri Sep 20 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 16 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    ...(Array(25).fill(0).map((_, i) =>
      [
        `Saturday ${`${i}`.padStart(2, "0")}:00:00`,
        `Sat Sep 21 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 16 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    ...(Array(24).fill(0).map((_, i) =>
      [
        `Sunday ${`${i}`.padStart(2, "0")}:00:00`,
        `Sun Sep 22 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 16 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    [
      "Sunday at 24:00:00 should count as the next week",
      "Sun Sep 22 2024 24:00:00 GMT+0000",
      "Mon Sep 23 2024 00:00:00 GMT+0000",
    ],
    ...(Array(25).fill(0).map((_, i) =>
      [
        `Next Monday ${`${i}`.padStart(2, "0")}:00:00`,
        `Mon Sep 23 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 23 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    ...(Array(25).fill(0).map((_, i) =>
      [
        `Next Tuesday ${`${i}`.padStart(2, "0")}:00:00`,
        `Tue Sep 24 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 23 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    ...(Array(25).fill(0).map((_, i) =>
      [
        `Next Wednesday ${`${i}`.padStart(2, "0")}:00:00`,
        `Wed Sep 25 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 23 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    ...(Array(25).fill(0).map((_, i) =>
      [
        `Next Thursday ${`${i}`.padStart(2, "0")}:00:00`,
        `Thu Sep 26 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 23 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    ...(Array(25).fill(0).map((_, i) =>
      [
        `Next Friday ${`${i}`.padStart(2, "0")}:00:00`,
        `Fri Sep 27 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 23 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    ...(Array(25).fill(0).map((_, i) =>
      [
        `Next Saturday ${`${i}`.padStart(2, "0")}:00:00`,
        `Sat Sep 28 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 23 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    ...(Array(24).fill(0).map((_, i) =>
      [
        `Next Sunday ${`${i}`.padStart(2, "0")}:00:00`,
        `Sun Sep 29 2024 ${`${i}`.padStart(2, "0")}:00:00 GMT+0000`,
        "Mon Sep 23 2024 00:00:00 GMT+0000",
      ] as [string, string, string]
    )),
    [
      "Next Sunday at 24:00:00 should count as the next week",
      "Sun Sep 29 2024 24:00:00 GMT+0000",
      "Mon Sep 30 2024 00:00:00 GMT+0000",
    ],
    [
      "Thursday that was problematic in other test - format 1",
      "Thu Sep 26 2024 15:53:31 GMT+0000",
      "2024-09-23T00:00:00.000Z",
    ],
    [
      "Thursday that was problematic in other test - format 2",
      "2024-09-26T15:53:31.870Z",
      "2024-09-23T00:00:00.000Z",
    ],
  ];

  tests.forEach(([name, given, expect]) => {
    it(name, () => {
      const result = getStartOfTheWeek0Ms(new Date(given).getTime());
      const _expect = new Date(expect);
      assertEquals(
        result,
        _expect.getTime(),
        `Expect \n ${_expect.toString()} \n got \n ${new Date(result).toString()}`,
      );
    });
  });
});
