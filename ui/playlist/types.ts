import { BeatSaberPlaylistSchema, BeatSaberPlaylistSongItemSchema } from "@/packages/types/beatsaber-playlist.ts";
import { BeatSaverMapResponseSuccessSchema, BeatSaverMapByHashResponseSchema } from "@/packages/types/beatsaver.ts";

export type WithMapAndBeatSaverMap = {
  map: typeof BeatSaberPlaylistSongItemSchema._type;
  beatsaverMap?: typeof BeatSaverMapResponseSuccessSchema._type | null;
}

export type WithMaps = {
  maps: typeof BeatSaberPlaylistSongItemSchema._type[];
}

export type WithBeatSaverMaps = {
  beatSaverMaps: typeof BeatSaverMapByHashResponseSchema._type;
}

export type WithPlaylist = {
  playlist: typeof BeatSaberPlaylistSchema._type;
};

export type WithPlaylists = {
  playlists: typeof BeatSaberPlaylistSchema._type[];
};
