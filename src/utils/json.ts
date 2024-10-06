import { BeatSaberPlaylistWithoutIdSchemaT } from "@/packages/types/beatsaber-playlist.ts";

export const stringify = <T>(value: T) => JSON.stringify(value, undefined, 2);

const mutate_moveKeyToTheTopOfTheObject = <T extends Record<string, unknown>>(value: T, key: keyof T) => {
  const cache = value[key];
  delete value[key];
  value[key] = cache;
};

const playlistKeyStructure: (keyof BeatSaberPlaylistWithoutIdSchemaT)[] = [
  "playlistTitle",
  "playlistAuthor",
  "customData",
  "songs",
  "image",
];

export const stringifyPlaylist = (value: BeatSaberPlaylistWithoutIdSchemaT) => {
  const v = value as Partial<BeatSaberPlaylistWithoutIdSchemaT>;
  playlistKeyStructure
    .forEach((key) => mutate_moveKeyToTheTopOfTheObject(v, key));
  return stringify(v);
};
