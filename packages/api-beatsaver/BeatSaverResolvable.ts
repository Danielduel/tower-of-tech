import { urlRegex } from "@/packages/utils/regex.ts";
import { LowercaseMapHash } from "@/packages/types/brands.ts";
import { BeatSaverMapId, makeBeatSaverMapId } from "@/packages/types/beatsaver.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { BeatSaberPlaylistSongItemDifficulty } from "@/src/types/BeatSaberPlaylist.d.ts";
import { difficultyMapping, difficultyMappingKeys } from "@/packages/api-beatsaver/difficultyMapping.ts";

export type BeatSaverResolvableHashKind = {
  kind: "hash";
  data: LowercaseMapHash;
  diffs: BeatSaberPlaylistSongItemDifficulty[];
};

export type BeatSaverResolvableIdKind = {
  kind: "id";
  data: BeatSaverMapId;
  diffs: BeatSaberPlaylistSongItemDifficulty[];
};

export type BeatSaverResolvable =
  | BeatSaverResolvableHashKind
  | BeatSaverResolvableIdKind;

const getDiffs = (raw: string) => {
  const results = difficultyMappingKeys
    .map(
      (key: keyof typeof difficultyMapping): BeatSaberPlaylistSongItemDifficulty[] | null => {
        if (difficultyMapping[key].matchers.some((matcher) => matcher.test(raw))) {
          return difficultyMapping[key].result;
        }
        return null;
      },
    ).filter(filterNulls)
    .flat();
  if (results.length > 0) {
    return results;
  }

  return [];
};

const getBeatSaverIdFromBeatSaverMapsUrl = (
  url: string,
): BeatSaverMapId | null => {
  const id = url.split("https://beatsaver.com/maps/")[1].toUpperCase();

  if (id === "") {
    return null;
  }

  return makeBeatSaverMapId(id);
};

const getBeatSaverResolvableFromBeatSaverMapsUrl = (raw: string, url: string): BeatSaverResolvableIdKind | null => {
  const id = getBeatSaverIdFromBeatSaverMapsUrl(url);

  if (!id) return null;

  return {
    kind: "id",
    data: id,
    diffs: getDiffs(raw),
  };
};

const getBeatSaverResolvableFromUrl = (raw: string, url: string): BeatSaverResolvableIdKind | null => {
  switch (true) {
    case url.startsWith("https://beatsaver.com/maps/"):
      return getBeatSaverResolvableFromBeatSaverMapsUrl(raw, url);
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
    .map((url) => getBeatSaverResolvableFromUrl(raw, url))
    .filter(filterNulls);

  return resolvables;
};

const getBeatSaverResolvableFromMessageWithOnlyId = (
  raw: string,
  lowerCaseRaw: string,
): BeatSaverResolvableIdKind | null => {
  const matches = lowerCaseRaw.match(/^[0-9a-f]+$/);

  if (!matches) {
    return null;
  }

  return {
    kind: "id",
    data: makeBeatSaverMapId(matches[0]),
    diffs: getDiffs(raw),
  };
};

const getBeatSaverResolvableFromMessageCommandLike = (
  raw: string,
  lowerCaseRaw: string,
  commandLike: string,
): BeatSaverResolvableIdKind | null => {
  const [, __split] = lowerCaseRaw.split(commandLike);
  const [_split] = __split.split(" ");
  const split = _split.trim();
  const matches = split.match(/^[0-9a-f]+$/);

  if (!matches) {
    return null;
  }

  return {
    kind: "id",
    data: makeBeatSaverMapId(matches[0]),
    diffs: getDiffs(raw),
  };
};

const getBeatSaverResolvableFromMessage = (raw: string, lowerCaseRaw: string): BeatSaverResolvable | null => {
  switch (true) {
    case lowerCaseRaw.startsWith("!bsr "):
      return getBeatSaverResolvableFromMessageCommandLike(raw, lowerCaseRaw, "!bsr ");
    case lowerCaseRaw.startsWith("bsr "):
      return getBeatSaverResolvableFromMessageCommandLike(raw, lowerCaseRaw, "bsr ");
    case lowerCaseRaw.startsWith("sr "):
      return getBeatSaverResolvableFromMessageCommandLike(raw, lowerCaseRaw, "sr ");
  }

  return getBeatSaverResolvableFromMessageWithOnlyId(raw, lowerCaseRaw);
};

const findBeatSaverResolvablesFromMessage = (raw: string) => {
  const lowerCaseRaw = raw.toLowerCase().trim();

  // recursive?

  const resolvable = getBeatSaverResolvableFromMessage(raw, lowerCaseRaw);

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
