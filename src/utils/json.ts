import { BeatSaberPlaylist } from "@/src/types/BeatSaberPlaylist.d.ts";

export const stringify = <T>(value: T) => JSON.stringify(value, undefined, 2);

const mutate_moveKeyToTheTopOfTheObject = <T extends Record<string, unknown>>(value: T, key: keyof T) => {
  const cache = value[key];
  delete value[key];
  value[key] = cache;
};

const playlistKeyStructure: (keyof BeatSaberPlaylist)[] = [
  "playlistTitle",
  "playlistAuthor",
  "customData",
  "songs",
  "image",
];

export const stringifyPlaylist = (value: BeatSaberPlaylist) => {
  const v = value as Partial<BeatSaberPlaylist>;
  playlistKeyStructure
    .forEach((key) => mutate_moveKeyToTheTopOfTheObject(v, key));
  return stringify(v);
};
