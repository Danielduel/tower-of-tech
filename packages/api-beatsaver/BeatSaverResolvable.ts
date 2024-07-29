import { urlRegex } from "@/packages/utils/regex.ts";
import { LowercaseMapHash } from "@/packages/types/brands.ts";
import { BeatSaverMapId, makeBeatSaverMapId } from "@/packages/types/beatsaver.ts";
import { filterNulls } from "@/packages/utils/filter.ts";

export type BeatSaverResolvableHashKind = {
  kind: "hash";
  data: LowercaseMapHash;
};

export type BeatSaverResolvableIdKind = {
  kind: "id";
  data: BeatSaverMapId;
};

export type BeatSaverResolvable =
  | BeatSaverResolvableHashKind
  | BeatSaverResolvableIdKind;

const getBeatSaverResolvableFromBeatSaverMapsUrl = (
  url: string,
): BeatSaverResolvableIdKind | null => {
  const id = url.split("https://beatsaver.com/maps/")[1].toUpperCase();

  if (id === "") {
    return null;
  }

  return {
    kind: "id",
    data: makeBeatSaverMapId(id),
  };
};

const getBeatSaverResolvableFromUrl = (url: string) => {
  switch (true) {
    case url.startsWith("https://beatsaver.com/maps/"):
      return getBeatSaverResolvableFromBeatSaverMapsUrl(url);
  }
  return null;
};

const findBeatSaverResolvablesInUrls = (
  raw: string,
): BeatSaverResolvable[] => {
  const matches = raw.match(urlRegex);

  if (!matches) {
    return [];
  }

  const urls = [matches[0]];
  const resolvables = urls
    .map(getBeatSaverResolvableFromUrl)
    .filter(filterNulls);

  return resolvables;
};

const getBeatSaverResolvableFromMessageWithOnlyId = (lowerCaseRaw: string) => {
  const matches = lowerCaseRaw.match(/^[0-9a-f]+$/);

  if (!matches) {
    return null;
  }

  return {
    kind: "id",
    data: makeBeatSaverMapId(matches[0]),
  };
};

const getBeatSaverResolvableFromMessageCommandLike = (
  lowerCaseRaw: string,
  commandLike: string,
) => {
  const [, _split] = lowerCaseRaw.split(commandLike);
  const split = _split.trim();
  const matches = split.match(/^[0-9a-f]+$/);

  if (!matches) {
    return null;
  }

  return {
    kind: "id",
    data: makeBeatSaverMapId(matches[0]),
  };
};

const getBeatSaverResolvableFromMessage = (lowerCaseRaw: string) => {
  switch (true) {
    case lowerCaseRaw.startsWith("!bsr "):
      return getBeatSaverResolvableFromMessageCommandLike(
        lowerCaseRaw,
        "!bsr ",
      );
    case lowerCaseRaw.startsWith("bsr "):
      return getBeatSaverResolvableFromMessageCommandLike(lowerCaseRaw, "bsr ");
    case lowerCaseRaw.startsWith("sr "):
      return getBeatSaverResolvableFromMessageCommandLike(lowerCaseRaw, "sr ");
  }

  return getBeatSaverResolvableFromMessageWithOnlyId(lowerCaseRaw);
};

const findBeatSaverResolvablesFromMessage = (raw: string) => {
  const lowerCaseRaw = raw.toLowerCase().trim();

  // recursive?

  const resolvable = getBeatSaverResolvableFromMessage(lowerCaseRaw);

  if (!resolvable) {
    return [];
  }

  return [resolvable];
};

export const findBeatSaverResolvables = (raw: string) => {
  const urlResolvables = findBeatSaverResolvablesInUrls(raw);
  const messageResolvables = findBeatSaverResolvablesFromMessage(raw);

  const resolvables = [
    ...urlResolvables,
    ...messageResolvables,
  ];

  if (!resolvables) {
    return {
      raw,
      resolvables: [],
    };
  }

  return {
    raw,
    resolvables,
  };
};

export const matchBeatSaverResolvable = <OnHashReturnValue, OnIdReturnValue>({
  onHashResolvable,
  onIdResolvable,
}: {
  onHashResolvable: (
    resolvable: BeatSaverResolvableHashKind,
  ) => OnHashReturnValue;
  onIdResolvable: (resolvable: BeatSaverResolvableIdKind) => OnIdReturnValue;
}) =>
(
  resolvable: BeatSaverResolvable,
): OnHashReturnValue | OnIdReturnValue | null => {
  if (resolvable.kind === "id") return onIdResolvable(resolvable);
  if (resolvable.kind === "hash") return onHashResolvable(resolvable);
  return null;
};

export const splitBeatSaverResolvables = (
  resolvables: BeatSaverResolvable[],
) => {
  const hashResolvables: BeatSaverResolvableHashKind[] = [];
  const idResolvables: BeatSaverResolvableIdKind[] = [];

  const innerForEach = matchBeatSaverResolvable({
    onHashResolvable: (x) => hashResolvables.push(x),
    onIdResolvable: (x) => idResolvables.push(x),
  });

  resolvables.forEach(innerForEach);

  return {
    hashResolvables,
    idResolvables,
  } as const;
};
