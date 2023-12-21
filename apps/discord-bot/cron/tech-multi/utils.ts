export function getStartAndEndTime() {
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;
  const weekMs = dayMs * 7;
  const nowMs = Date.now();
  const lastThursday0Ms = nowMs - (nowMs % weekMs);
  const nextThursday0Ms = lastThursday0Ms + 7 * dayMs;
  const timezoneOffset = +(Intl
    .DateTimeFormat(
      [],
      { timeZone: "Europe/Warsaw", timeZoneName: "short" },
    )
    .formatToParts(nextThursday0Ms)
    .find((part) => part.type === "timeZoneName") ?? { value: "GMT+1" })
    .value
    .split("+")[1];
  const timezonedNextThursday0Ms = nextThursday0Ms - timezoneOffset * hourMs;
  const scheduledStartTime = timezonedNextThursday0Ms + 20 * hourMs;
  const scheduledEndTime = timezonedNextThursday0Ms + 22 * hourMs;

  return {
    scheduledStartTime,
    scheduledEndTime,
  } as const;
}

export function getStartAndEndTimeToday() {
  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;
  const weekMs = dayMs * 7;
  const nowMs = Date.now();
  const today0Ms = nowMs - (nowMs % weekMs);
  const timezoneOffset = +(Intl
    .DateTimeFormat(
      [],
      { timeZone: "Europe/Warsaw", timeZoneName: "short" },
    )
    .formatToParts(today0Ms)
    .find((part) => part.type === "timeZoneName") ?? { value: "GMT+1" })
    .value
    .split("+")[1];
  const timezonedNextThursday0Ms = today0Ms - timezoneOffset * hourMs;
  const scheduledStartTime = timezonedNextThursday0Ms + 20 * hourMs;
  const scheduledEndTime = timezonedNextThursday0Ms + 22 * hourMs;

  return {
    scheduledStartTime,
    scheduledEndTime,
  } as const;
}
