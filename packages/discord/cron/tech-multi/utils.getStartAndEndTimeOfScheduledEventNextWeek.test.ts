import { describe, it } from "jsr:@std/testing/bdd";
import { assertEquals } from "@/packages/test/deps.ts";
import {
  getStartAndEndTimeOfScheduledEventNextWeek,
  getStartOfTheWeek0Ms,
} from "@/packages/discord/cron/tech-multi/utils.ts";

describe("getStartAndEndTimeOfScheduledEventNextWeek", () => {
  type Given = string;
  type Expect = {
    scheduledStartTime: string;
    scheduledEndTime: string;
  };

  const tests: [string, Given, Expect][] = [
    // winter time (Warsaw is +02:00)
    [
      "Friday, 6 days before event, winter time - should return the timezoned time of the next event",
      "2024-09-20T23:13:31.870Z",
      {
        scheduledStartTime: "2024-09-26T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-26T22:00:00.000+02:00",
      },
    ],
    [
      "Saturday, 5 days before event, winter time - should return the timezoned time of the next event",
      "2024-09-21T23:13:31.870Z",
      {
        scheduledStartTime: "2024-09-26T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-26T22:00:00.000+02:00",
      },
    ],
    [
      "Sunday, 4 days before event, winter time - should return the timezoned time of the next event",
      "2024-09-22T23:13:31.870Z",
      {
        scheduledStartTime: "2024-09-26T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-26T22:00:00.000+02:00",
      },
    ],
    [
      "Monday, 3 days before event, winter time - should ignore event that happens this week and return next week",
      "2024-09-23T23:13:31.870Z",
      {
        scheduledStartTime: "2024-10-03T20:00:00.000+02:00",
        scheduledEndTime: "2024-10-03T22:00:00.000+02:00",
      },
    ],
    [
      "Tuesday, 2 days before event, winter time - should ignore event that happens this week and return next week",
      "2024-09-24T23:13:31.870Z",
      {
        scheduledStartTime: "2024-10-03T20:00:00.000+02:00",
        scheduledEndTime: "2024-10-03T22:00:00.000+02:00",
      },
    ],
    [
      "Wednesday, a day before event, winter time - should ignore event that happens this week and return next week",
      "2024-09-25T23:13:31.870Z",
      {
        scheduledStartTime: "2024-10-03T20:00:00.000+02:00",
        scheduledEndTime: "2024-10-03T22:00:00.000+02:00",
      },
    ],
    [
      "Thursday, a day of an event, before event, winter time - should ignore event that happens this day and return next week",
      "2024-09-26T15:53:31.870Z",
      {
        scheduledStartTime: "2024-10-03T20:00:00.000+02:00",
        scheduledEndTime: "2024-10-03T22:00:00.000+02:00",
      },
    ],
    [
      "Thursday, a day of an event, when event starts, winter time - should ignore event that happens this day and return next week",
      "2024-09-26T18:00:00.000Z",
      {
        scheduledStartTime: "2024-10-03T20:00:00.000+02:00",
        scheduledEndTime: "2024-10-03T22:00:00.000+02:00",
      },
    ],
    [
      "Thursday, a day of an event, during event, winter time - should ignore event that happens this day and return next week",
      "2024-09-26T19:00:00.000Z",
      {
        scheduledStartTime: "2024-10-03T20:00:00.000+02:00",
        scheduledEndTime: "2024-10-03T22:00:00.000+02:00",
      },
    ],
    [
      "Thursday, a day of an event, at the event's end, winter time - should ignore event that happens this day and return next week",
      "2024-09-26T20:00:00.000Z",
      {
        scheduledStartTime: "2024-10-03T20:00:00.000+02:00",
        scheduledEndTime: "2024-10-03T22:00:00.000+02:00",
      },
    ],
    [
      "Thursday, a day of an event, after event, winter time - should ignore event that happens this day and return next week",
      "2024-09-26T23:00:00.000Z",
      {
        scheduledStartTime: "2024-10-03T20:00:00.000+02:00",
        scheduledEndTime: "2024-10-03T22:00:00.000+02:00",
      },
    ],
    [
      "Friday, a day after event, winter time - should return next event",
      "2024-09-27T15:00:00.000Z",
      {
        scheduledStartTime: "2024-10-03T20:00:00.000+02:00",
        scheduledEndTime: "2024-10-03T22:00:00.000+02:00",
      },
    ],
    // summer time (Warsaw is +01:00)
    [
      "Friday, 6 days before event, summer time - should return the timezoned time of the next event",
      "2024-03-15T23:13:31.870Z",
      {
        scheduledStartTime: "2024-03-21T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-21T22:00:00.000+01:00",
      },
    ],
    [
      "Saturday, 5 days before event, summer time - should return the timezoned time of the next event",
      "2024-03-16T23:13:31.870Z",
      {
        scheduledStartTime: "2024-03-21T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-21T22:00:00.000+01:00",
      },
    ],
    [
      "Sunday, 4 days before event, summer time - should return the timezoned time of the next event",
      "2024-03-17T23:13:31.870Z",
      {
        scheduledStartTime: "2024-03-21T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-21T22:00:00.000+01:00",
      },
    ],
    [
      "Monday, 3 days before event, summer time - should ignore event that happens this week and return next week",
      "2024-03-18T23:13:31.870Z",
      {
        scheduledStartTime: "2024-03-28T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-28T22:00:00.000+01:00",
      },
    ],
    [
      "Tuesday, 2 days before event, summer time - should ignore event that happens this week and return next week",
      "2024-03-19T23:13:31.870Z",
      {
        scheduledStartTime: "2024-03-28T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-28T22:00:00.000+01:00",
      },
    ],
    [
      "Wednesday, a day before event, summer timezone - should ignore event that happens this week and return next week",
      "2024-03-20T22:13:31.870Z",
      {
        scheduledStartTime: "2024-03-28T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-28T22:00:00.000+01:00",
      },
    ],
    [
      "Thursday, a day of an event, before event, summer timezone - should ignore event that happens this day and return next week",
      "2024-03-21T15:53:31.870Z",
      {
        scheduledStartTime: "2024-03-28T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-28T22:00:00.000+01:00",
      },
    ],
    [
      "Thursday, a day of an event, when event starts, summer timezone - should ignore event that happens this day and return next week",
      "2024-03-21T18:00:00.000Z",
      {
        scheduledStartTime: "2024-03-28T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-28T22:00:00.000+01:00",
      },
    ],
    [
      "Thursday, a day of an event, during event, summer timezone - should ignore event that happens this day and return next week",
      "2024-03-21T19:00:00.000Z",
      {
        scheduledStartTime: "2024-03-28T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-28T22:00:00.000+01:00",
      },
    ],
    [
      "Thursday, a day of an event, at the event's end, summer timezone - should ignore event that happens this day and return next week",
      "2024-03-21T20:00:00.000Z",
      {
        scheduledStartTime: "2024-03-28T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-28T22:00:00.000+01:00",
      },
    ],
    [
      "Thursday, a day of an event, after event, summer timezone - should ignore event that happens this day and return next week",
      "2024-03-21T23:00:00.000Z",
      {
        scheduledStartTime: "2024-03-28T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-28T22:00:00.000+01:00",
      },
    ],
    [
      "Friday, a day after event, summer timezone - should return next event",
      "2024-03-22T15:00:00.000Z",
      {
        scheduledStartTime: "2024-03-28T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-28T22:00:00.000+01:00",
      },
    ],
  ];

  tests.forEach(([name, given, expect]) => {
    it(name, () => {
      const _given = new Date(given).getTime();
      const result = getStartAndEndTimeOfScheduledEventNextWeek(_given);
      const debugInfoStartOfTheWeek0Ms = getStartOfTheWeek0Ms(_given);
      const _expect = {
        scheduledStartTime: new Date(expect.scheduledStartTime).getTime(),
        scheduledEndTime: new Date(expect.scheduledEndTime).getTime(),
      };
      assertEquals(
        result,
        _expect,
        `
        \nGiven: \
        \n${new Date(given).toString()} \
        \nStart of the week: \
        \n${new Date(debugInfoStartOfTheWeek0Ms).toString()} \
        \nResult: \
        \n${new Date(result.scheduledStartTime).toString()} \
        \n${new Date(result.scheduledEndTime).toString()} \
        \nExpect: \
        \n${new Date(_expect.scheduledStartTime).toString()} \
        \n${new Date(_expect.scheduledStartTime).toString()}`,
      );
    });
  });
});
