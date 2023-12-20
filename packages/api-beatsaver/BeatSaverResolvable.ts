import { urlRegex } from "@/packages/utils/regex.ts";
import { LowercaseMapHash } from "@/packages/types/brands.ts";
import { BeatSaverMapId, makeBeatSaverMapId } from "@/packages/types/beatsaver.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { z } from "zod";

export type BeatSaverResolvableHashKind = {
  kind: "hash";
  data: LowercaseMapHash;
};

export type BeatSaverResolvableIdKind = {
  kind: "id";
  data: BeatSaverMapId;
};

export type BeatSaverResolvable = BeatSaverResolvableHashKind | BeatSaverResolvableIdKind;

const getBeatSaverResolvableFromBeatSaverMapsUrl = (url: string): BeatSaverResolvableIdKind => {
  const id = url.split("https://beatsaver.com/maps/")[1].toUpperCase();
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


export const findBeatSaverResolvables = (raw: string) => {
  const matches = raw.match(urlRegex);
  if (!matches) return {
    raw,
    urls: null,
    resolvables: []
  };

  const urls = [matches[0]];
  const resolvables = urls
    .map(getBeatSaverResolvableFromUrl)
    .filter(filterNulls);

  return {
    raw,
    urls,
    resolvables
  };
};

export const matchBeatSaverResolvable = ({
  onHashResolvable,
  onIdResolvable
}: {
  onHashResolvable: (resolvable: BeatSaverResolvableHashKind) => void,
  onIdResolvable: (resolvable: BeatSaverResolvableIdKind) => void,
}) => (resolvable: BeatSaverResolvable) => {
  if (resolvable.kind === "id") return onIdResolvable(resolvable);
  if (resolvable.kind === "hash") return onHashResolvable(resolvable);
}

export const splitBeatSaverResolvables = (resolvables: BeatSaverResolvable[]) => {
  const hashResolvables: BeatSaverResolvableHashKind[] = [];
  const idResolvables: BeatSaverResolvableIdKind[] = [];

  const innerForEach = matchBeatSaverResolvable({
    onHashResolvable: x => hashResolvables.push(x),
    onIdResolvable: x => idResolvables.push(x),
  })

  resolvables.forEach(innerForEach);
  
  return {
    hashResolvables,
    idResolvables
  } as const;
}
