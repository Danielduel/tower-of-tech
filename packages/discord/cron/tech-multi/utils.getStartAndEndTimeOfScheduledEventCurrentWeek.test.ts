import { assertEquals, describe, it } from "@/packages/deps/test.ts";
import {
  getStartAndEndTimeOfScheduledEventCurrentWeek,
  getStartOfTheWeek0Ms,
} from "@/packages/discord/cron/tech-multi/utils.ts";

describe("getStartAndEndTimeOfScheduledEventCurrentWeek", () => {
  type Given = string;
  type Expect = {
    scheduledStartTime: string;
    scheduledEndTime: string;
  };

  const tests: [string, Given, Expect][] = [
    // winter time (Warsaw is +02:00)
    [
      "Friday, 6 days before event, winter time - should return the timezoned time of an event that happened a day before",
      "2024-09-20T23:13:31.870Z",
      {
        scheduledStartTime: "2024-09-19T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-19T22:00:00.000+02:00",
      },
    ],
    [
      "Saturday, 5 days before event, winter time - should return the timezoned time of an event that happened 2 days before",
      "2024-09-21T23:13:31.870Z",
      {
        scheduledStartTime: "2024-09-19T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-19T22:00:00.000+02:00",
      },
    ],
    [
      "Sunday, 4 days before event, winter time - should return the timezoned time of an event that happened 3 days before",
      "2024-09-22T23:13:31.870Z",
      {
        scheduledStartTime: "2024-09-19T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-19T22:00:00.000+02:00",
      },
    ],
    [
      "Monday, 3 days before event, winter time - should return the timezoned time of the next event in 3 days",
      "2024-09-23T23:13:31.870Z",
      {
        scheduledStartTime: "2024-09-26T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-26T22:00:00.000+02:00",
      },
    ],
    [
      "Tuesday, 2 days before event, winter time - should return the timezoned time of the next event in 2 days",
      "2024-09-24T23:13:31.870Z",
      {
        scheduledStartTime: "2024-09-26T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-26T22:00:00.000+02:00",
      },
    ],
    [
      "Wednesday, a day before event, winter time - should return the timezoned time of the next event in a day",
      "2024-09-25T23:13:31.870Z",
      {
        scheduledStartTime: "2024-09-26T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-26T22:00:00.000+02:00",
      },
    ],
    [
      "Thursday, a day of an event, before event, winter time - should return the timezoned time that day",
      "2024-09-26T15:53:31.870Z",
      {
        scheduledStartTime: "2024-09-26T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-26T22:00:00.000+02:00",
      },
    ],
    [
      "Thursday, a day of an event, when event starts, winter time - should return the timezoned time that day",
      "2024-09-26T18:00:00.000Z",
      {
        scheduledStartTime: "2024-09-26T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-26T22:00:00.000+02:00",
      },
    ],
    [
      "Thursday, a day of an event, during event, winter time - should return the timezoned time that day",
      "2024-09-26T19:00:00.000Z",
      {
        scheduledStartTime: "2024-09-26T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-26T22:00:00.000+02:00",
      },
    ],
    [
      "Thursday, a day of an event, at the event's end, winter time - should return the timezoned time that day",
      "2024-09-26T20:00:00.000Z",
      {
        scheduledStartTime: "2024-09-26T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-26T22:00:00.000+02:00",
      },
    ],
    [
      "Thursday, a day of an event, after event, winter time - should result with timezoned time that day",
      "2024-09-26T23:00:00.000Z",
      {
        scheduledStartTime: "2024-09-26T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-26T22:00:00.000+02:00",
      },
    ],
    [
      "Friday, a day after event, winter time - should result with timezoned a day ago",
      "2024-09-27T15:00:00.000Z",
      {
        scheduledStartTime: "2024-09-26T20:00:00.000+02:00",
        scheduledEndTime: "2024-09-26T22:00:00.000+02:00",
      },
    ],
    // summer time (Warsaw is +01:00)
    [
      "Friday, 6 days before event, summer time - should result on returning the timezoned time a day after",
      "2024-03-13T23:13:31.870Z",
      {
        scheduledStartTime: "2024-03-14T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-14T22:00:00.000+01:00",
      },
    ],
    [
      "Saturday, 5 days before event, summer time - should result on returning the timezoned time a day after",
      "2024-03-13T23:13:31.870Z",
      {
        scheduledStartTime: "2024-03-14T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-14T22:00:00.000+01:00",
      },
    ],
    [
      "Sunday, 4 days before event, summer time - should result on returning the timezoned time a day after",
      "2024-03-13T23:13:31.870Z",
      {
        scheduledStartTime: "2024-03-14T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-14T22:00:00.000+01:00",
      },
    ],
    [
      "Monday, 3 days before event, summer time - should result on returning the timezoned time a day after",
      "2024-03-13T23:13:31.870Z",
      {
        scheduledStartTime: "2024-03-14T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-14T22:00:00.000+01:00",
      },
    ],
    [
      "Tuesday, 2 days before event, summer time - should result on returning the timezoned time a day after",
      "2024-03-13T23:13:31.870Z",
      {
        scheduledStartTime: "2024-03-14T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-14T22:00:00.000+01:00",
      },
    ],
    [
      "Wednesday, a day before event, summer timezone - should result on returning the timezoned time a day after",
      "2024-03-13T22:13:31.870Z",
      {
        scheduledStartTime: "2024-03-14T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-14T22:00:00.000+01:00",
      },
    ],
    [
      "Thursday, a day of an event, before event, summer timezone - should result with timezoned time that day",
      "2024-03-14T15:53:31.870Z",
      {
        scheduledStartTime: "2024-03-14T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-14T22:00:00.000+01:00",
      },
    ],
    [
      "Thursday, a day of an event, when event starts, summer timezone - should result with timezoned time that day",
      "2024-03-14T18:00:00.000Z",
      {
        scheduledStartTime: "2024-03-14T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-14T22:00:00.000+01:00",
      },
    ],
    [
      "Thursday, a day of an event, during event, summer timezone - should result with timezoned time that day",
      "2024-03-14T19:00:00.000Z",
      {
        scheduledStartTime: "2024-03-14T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-14T22:00:00.000+01:00",
      },
    ],
    [
      "Thursday, a day of an event, at the event's end, summer timezone - should result with timezoned time that day",
      "2024-03-14T20:00:00.000Z",
      {
        scheduledStartTime: "2024-03-14T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-14T22:00:00.000+01:00",
      },
    ],
    [
      "Thursday, a day of an event, after event, summer timezone - should result with timezoned time that day",
      "2024-03-14T23:00:00.000Z",
      {
        scheduledStartTime: "2024-03-14T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-14T22:00:00.000+01:00",
      },
    ],
    [
      "Friday, a day after event, summer timezone - should result with timezoned a day ago",
      "2024-03-15T15:00:00.000Z",
      {
        scheduledStartTime: "2024-03-14T20:00:00.000+01:00",
        scheduledEndTime: "2024-03-14T22:00:00.000+01:00",
      },
    ],
  ];

  tests.forEach(([name, given, expect]) => {
    it(name, () => {
      const _given = new Date(given).getTime();
      const result = getStartAndEndTimeOfScheduledEventCurrentWeek(_given);
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
