import { Err, Ok, Result } from "@/packages/utils/optionals.ts";

const beatLeaderRegex: RegExp[] = [
  /^https:\/\/www\.beatleader\.xyz/,
];

export const extractBeatLeaderUrlFromTwitchChatResponse = (message: string): Result<string[], Error> => {
  const arr = message.split(" ");
  const url = arr.filter((x) => beatLeaderRegex.some((rx) => rx.test(x)));
  if (url.length > 0) {
    return Ok(url);
  }
  return Err("BeatLeader url haven't been found");
};

export const extractBeatLeaderProfileIdFromUserUrl = (url: string): Result<string, Error> => {
  const arr = url.split("/u/");
  if (arr.length === 2) {
    return Ok(arr[1]);
  }
  return Err(`BeatLeader can't extract profile id ${url}`);
};

export const extractBeatLeaderProfileIdFromTwitchChatResponse = (message: string) => {
  const urlM = extractBeatLeaderUrlFromTwitchChatResponse(message);

  if (urlM.isErr()) {
    console.error(urlM.unwrapErr());
    return null;
  }

  const url = urlM.unwrap()[0];
  const idM = extractBeatLeaderProfileIdFromUserUrl(url);

  if (idM.isErr()) {
    console.error(idM.unwrapErr());
    return null;
  }
  return idM.unwrap();
};

