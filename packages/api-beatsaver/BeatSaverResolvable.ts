import { urlRegex } from "@/packages/utils/regex.ts";
import { LowercaseMapHash } from "@/packages/types/brands.ts";
import { BeatSaverMapId, makeBeatSaverMapId } from "@/packages/types/beatsaver.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { BeatSaberPlaylistSongItemDifficulty } from "@/src/types/BeatSaberPlaylist.d.ts";

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
  const _split = raw.split("[")[1] || raw.split("(");
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

const getBeatSaverResolvableFromBeatSaverMapsUrl = (url: string, raw: string): BeatSaverResolvableIdKind | null => {
  const id = getBeatSaverIdFromBeatSaverMapsUrl(url);

  if (!id) return null;

  return {
    kind: "id",
    data: id,
    diffs: [],
  };
};

const getBeatSaverResolvableFromUrl = (raw: string) => (url: string): BeatSaverResolvableIdKind | null => {
  switch (true) {
    case url.startsWith("https://beatsaver.com/maps/"):
      return getBeatSaverResolvableFromBeatSaverMapsUrl(url, raw);
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
    .map(getBeatSaverResolvableFromUrl(raw))
    .filter(filterNulls);

  return resolvables;
};

const getBeatSaverResolvableFromMessageWithOnlyId = (lowerCaseRaw: string): BeatSaverResolvableIdKind | null => {
  const matches = lowerCaseRaw.match(/^[0-9a-f]+$/);

  if (!matches) {
    return null;
  }

  return {
    kind: "id",
    data: makeBeatSaverMapId(matches[0]),
    diffs: [],
  };
};

const getBeatSaverResolvableFromMessageCommandLike = (
  lowerCaseRaw: string,
  commandLike: string,
): BeatSaverResolvableIdKind | null => {
  const [, _split] = lowerCaseRaw.split(commandLike);
  const split = _split.trim();
  const matches = split.match(/^[0-9a-f]+$/);

  if (!matches) {
    return null;
  }

  return {
    kind: "id",
    data: makeBeatSaverMapId(matches[0]),
    diffs: [],
  };
};

const getBeatSaverResolvableFromMessage = (lowerCaseRaw: string): BeatSaverResolvable | null => {
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
