import { DAY_MS, HOUR_MS, WEEK_DAY_ENUM, WEEK_MS } from "@/packages/utils/time.ts";
import { Err, Ok, Result } from "@/packages/utils/optionals.ts";

export function getStartOfTheWeek0Ms(nowMs = Date.now()) {
  // start of the unix time week is Thursday
  const WEEKSTART_OFFSET_MS = 4 * DAY_MS;
  const epochStartsAtMonday = nowMs - WEEKSTART_OFFSET_MS;
  const mondayWhenItStartsAtMonday = epochStartsAtMonday - (epochStartsAtMonday % WEEK_MS);
  return mondayWhenItStartsAtMonday + WEEKSTART_OFFSET_MS;
}

const timezoneMappingToUTC: Record<string, number> = {
  AST: -3,
  ADT: -3, // ??
  CST: -6,
  CDT: -6,
  MDT: -6,
  MST: -7,
  PDT: -7,
  PST: -8,
  AKST: -9,
  AKDT: -8,
  HAST: -10, // ?
  HADT: -9, // ?
  HST: -10,
  HDT: -9,
  GMT: 0,
  EDT: -4,
  EST: -5,
};

export function getTimezoneOffsetO(time: number, timeZone: string): Result<number, Error> {
  const timezoneParts = Intl
    .DateTimeFormat(
      [],
      { timeZone, timeZoneName: "short" },
    )
    .formatToParts(time);

  const timezoneName = timezoneParts
    .find((part) => part.type === "timeZoneName");
  const stringOffset = timezoneName?.value;

  if (!stringOffset) {
    console.warn(
      "Invalid timezone for",
      time,
      timeZone,
      timezoneParts,
      timezoneName,
      stringOffset,
    );
    return Err("Invalid timezone");
  }

  if (stringOffset.includes("+")) {
    const value = +stringOffset.split("+")[1];
    return Ok(value);
  }

  if (stringOffset.includes("-")) {
    const value = +stringOffset.split("-")[1];
    return Ok(-value);
  }

  if (stringOffset === "GMT") {
    return Ok(0);
  }

  if (stringOffset in timezoneMappingToUTC) {
    return Ok(timezoneMappingToUTC[stringOffset]);
  }

  console.warn(
    "Unhandled timezone for",
    time,
    timeZone,
    timezoneParts,
    timezoneName,
    stringOffset,
  );

  return Err("Unhandled timezone");
}

export function getTimezoneOffsetMs(time: number, timeZone = "Europe/Warsaw") {
  const timezoneOffsetO = getTimezoneOffsetO(time, timeZone);
  const timezoneOffset = timezoneOffsetO.unwrapOrElse(() => 0);
  return timezoneOffset * HOUR_MS;
}

export function getStartAndEndTimeOfScheduledEventCurrentWeek(nowMs = Date.now(), opts = {
  startHour: 20,
  endHour: 22,
  dayOfTheEvent: WEEK_DAY_ENUM.THURSDAY,
  timeZone: "Europe/Warsaw",
}) {
  const startOfTheCurrentWeek0Ms = getStartOfTheWeek0Ms(nowMs);

  const dayOfTheEvent0Ms = startOfTheCurrentWeek0Ms + (opts.dayOfTheEvent * DAY_MS);
  const dayOfTheEventTimezoneOffsetMs = getTimezoneOffsetMs(dayOfTheEvent0Ms, opts.timeZone);

  const timezonedDayOfTheEvent0Ms = dayOfTheEvent0Ms - dayOfTheEventTimezoneOffsetMs;

  const scheduledStartTime = timezonedDayOfTheEvent0Ms + opts.startHour * HOUR_MS;
  const scheduledEndTime = timezonedDayOfTheEvent0Ms + opts.endHour * HOUR_MS;

  return {
    scheduledStartTime,
    scheduledEndTime,
  } as const;
}

export function getStartAndEndTimeOfScheduledEventNextWeek(nowMs = Date.now(), opts = {
  startHour: 20,
  endHour: 22,
  dayOfTheEvent: WEEK_DAY_ENUM.THURSDAY,
  timeZone: "Europe/Warsaw",
}) {
  const startOfTheCurrentWeek0Ms = getStartOfTheWeek0Ms(nowMs);
  const startOfTheNextWeek = startOfTheCurrentWeek0Ms + WEEK_MS;

  const dayOfTheEvent0Ms = startOfTheNextWeek + (opts.dayOfTheEvent * DAY_MS);
  const dayOfTheEventTimezoneOffsetMs = getTimezoneOffsetMs(dayOfTheEvent0Ms, opts.timeZone);

  const timezonedDayOfTheEvent0Ms = dayOfTheEvent0Ms - dayOfTheEventTimezoneOffsetMs;

  const scheduledStartTime = timezonedDayOfTheEvent0Ms + opts.startHour * HOUR_MS;
  const scheduledEndTime = timezonedDayOfTheEvent0Ms + opts.endHour * HOUR_MS;

  return {
    scheduledStartTime,
    scheduledEndTime,
  } as const;
}

// Modified source from https://jsr.io/@mtb/time/0.1.2
export const getTimeAgo = (props: string | number | Date, dateNow = Date.now()): string => {
  const stamp = Math.round(new Date(props).getTime() / 1000);
  const now = Math.round(dateNow / 1000);

  const distance = Math.abs(now - stamp);
  let unit;
  let value;

  if (distance / 60 < 60) {
    unit = "minutes";
    value = Math.round(distance / 60);

    if (value <= 1) {
      unit = "minute";
    }
  } else if (distance / (60 * 60) < 24) {
    unit = "hours";
    value = Math.round(distance / (60 * 60));

    if (value <= 1) {
      unit = "hour";
    }
  } else {
    unit = "days";
    value = Math.round(distance / (60 * 60 * 24));

    if (value <= 1) {
      unit = "day";
    }
  }

  const output = `${value} ${unit}`;

  // console.log(unit, value)
  return output;
};

export const getRelativeTime = (dateNow = Date.now()) => {
  const schedule = getStartAndEndTimeOfScheduledEventCurrentWeek(dateNow);
  const relativeStartMs = dateNow - schedule.scheduledStartTime;
  const relativeEndMs = dateNow - schedule.scheduledEndTime;

  const isBefore = relativeStartMs < 0;
  const isDuring = relativeStartMs >= 0 && relativeEndMs < 0;
  const isAfter = relativeEndMs >= 0;

  const relativeStart = getTimeAgo(schedule.scheduledStartTime, dateNow);
  const relativeEnd = getTimeAgo(schedule.scheduledEndTime, dateNow);

  return {
    relativeStart,
    relativeStartMs,
    relativeEnd,
    relativeEndMs,
    isBefore,
    isDuring,
    isAfter,
  };
};

export const getRelativeTimeNextWeek = (dateNow = Date.now()) => {
  const schedule = getStartAndEndTimeOfScheduledEventNextWeek(dateNow);
  const relativeStartMs = dateNow - schedule.scheduledStartTime;
  const relativeEndMs = dateNow - schedule.scheduledEndTime;

  const isBefore = relativeStartMs < 0;
  const isDuring = relativeStartMs >= 0 && relativeEndMs < 0;
  const isAfter = relativeEndMs >= 0;

  const relativeStart = getTimeAgo(schedule.scheduledStartTime, dateNow);
  const relativeEnd = getTimeAgo(schedule.scheduledEndTime, dateNow);

  return {
    relativeStart,
    relativeStartMs,
    relativeEnd,
    relativeEndMs,
    isBefore,
    isDuring,
    isAfter,
  };
};

// export const getRelativeTimeStandard_ = (dateNow = Date.now()) => {
//   const schedule = getStartAndEndTimeStandard(dateNow);
//   const relativeStartMs = dateNow - schedule.scheduledStartTime;
//   const relativeEndMs = dateNow - schedule.scheduledEndTime;

//   const isBefore = relativeStartMs < 0;
//   const isDuring = relativeStartMs >= 0 && relativeEndMs < 0;
//   const isAfter = relativeEndMs >= 0;

//   const relativeStart = getTimeAgo(schedule.scheduledStartTime, dateNow);
//   const relativeEnd = getTimeAgo(schedule.scheduledEndTime, dateNow);

//   return {
//     relativeStart,
//     relativeStartMs,
//     relativeEnd,
//     relativeEndMs,
//     isBefore,
//     isDuring,
//     isAfter,
//   };
// };

export const relativeStartMsToTechMultiStage = (relativeStartMs: number) => {
  const minMs = 60 * 1000;
  if (relativeStartMs - minMs * 15 < 0) return "warmup";
  if (relativeStartMs - minMs * 30 < 0) return "adeptech";
  if (relativeStartMs - minMs * 45 < 0) return "acctech";
  if (relativeStartMs - minMs * 60 < 0) return "acchitech";
  if (relativeStartMs - minMs * 90 < 0) return "hitech";
  if (relativeStartMs - minMs * 110 < 0) return "hard hitech";
  return "finishing";
};

export const relativeStartMsToStandardStage = (relativeStartMs: number) => {
  const minMs = 60 * 1000;
  if (relativeStartMs - minMs * 15 < 0) return "warmup";
  if (relativeStartMs - minMs * 90 < 0) return "techaccing";
  if (relativeStartMs - minMs * 120 < 0) return "faster stuff";
  return "even faster stuff";
};

export const relativeStartMsToTechMultiProgress = (relativeStartMs: number) => {
  const minMs = 60 * 1000;
  if (relativeStartMs - minMs * 12 < 0) return "▒▒▒▒▒▒▒▒▒▒ 0%";
  if (relativeStartMs - minMs * 24 < 0) return "█▒▒▒▒▒▒▒▒▒ 10%";
  if (relativeStartMs - minMs * 36 < 0) return "██▒▒▒▒▒▒▒▒ 20%";
  if (relativeStartMs - minMs * 48 < 0) return "███▒▒▒▒▒▒▒ 30%";
  if (relativeStartMs - minMs * 60 < 0) return "████▒▒▒▒▒▒ 40%";
  if (relativeStartMs - minMs * 72 < 0) return "█████▒▒▒▒▒ 50%";
  if (relativeStartMs - minMs * 84 < 0) return "██████▒▒▒▒ 60%";
  if (relativeStartMs - minMs * 96 < 0) return "███████▒▒▒ 70%";
  if (relativeStartMs - minMs * 108 < 0) return "████████▒▒ 80%";
  if (relativeStartMs - minMs * 120 < 0) return "█████████▒ 90%";
  return "██████████ 100%";
};

export const getRelativeTimeTechMulti = (dateNow = Date.now()) => {
  const relativeTime = getRelativeTime(
    dateNow,
  );

  const { relativeStart, relativeStartMs, relativeEnd, relativeEndMs, isBefore, isDuring, isAfter } = relativeTime;

  console.log(relativeStartMs);

  if (isBefore) {
    return {
      time: `starts in ${relativeStart}`,
      stage: relativeStartMsToTechMultiStage(relativeStartMs),
      progress: relativeStartMsToTechMultiProgress(relativeStartMs),
    };
  }

  if (isDuring && relativeEnd.includes("1 hour") && !relativeStart.includes("1 hour")) {
    return {
      time: `will go for ${relativeEnd}`,
      stage: relativeStartMsToTechMultiStage(relativeStartMs),
      progress: relativeStartMsToTechMultiProgress(relativeStartMs),
    };
  }

  if (isDuring) {
    return {
      time: `will go for ${relativeEnd}`,
      stage: relativeStartMsToTechMultiStage(relativeStartMs),
      progress: relativeStartMsToTechMultiProgress(relativeStartMs),
    };
  }

  if (isAfter) {
    return {
      time: `goes for ${relativeEnd} after end`,
      stage: relativeStartMsToTechMultiStage(relativeStartMs),
      progress: relativeStartMsToTechMultiProgress(relativeStartMs),
    };
  }

  return {
    time: `:eyes:`,
    stage: `:eyes:`,
    progress: `:eyes:`,
  };
};

// export const getRelativeTimeStandard = (dateNow = Date.now()) => {
//   const relativeTime = getRelativeTimeStandard_(
//     dateNow,
//   );

//   const { relativeStart, relativeStartMs, relativeEnd, relativeEndMs, isBefore, isDuring, isAfter } = relativeTime;

//   console.log(relativeStartMs);

//   if (isBefore) {
//     return {
//       time: `starts in ${relativeStart}`,
//       stage: "",
//       progress: "",
//     };
//   }

//   if (isDuring && relativeEnd.includes("1 hour") && !relativeStart.includes("1 hour")) {
//     return {
//       time: "",
//       stage: relativeStartMsToStandardStage(relativeStartMs),
//       progress: "",
//     };
//   }

//   if (isDuring) {
//     return {
//       time: "",
//       stage: relativeStartMsToStandardStage(relativeStartMs),
//       progress: "",
//     };
//   }

//   if (isAfter) {
//     return {
//       time: "",
//       stage: relativeStartMsToStandardStage(relativeStartMs),
//       progress: "",
//     };
//   }

//   return {
//     time: `:eyes:`,
//     stage: `:eyes:`,
//     progress: `:eyes:`,
//   };
// };
