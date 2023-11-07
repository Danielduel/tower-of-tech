import { BeatSaberPlaylistSchema, BeatSaberPlaylistSongItemSchema } from "@/types/beatsaber-playlist.ts";
import { BeatSaverMapResponseSuccessSchema } from "@/types/beatsaver.ts";

export type WithMapAndBeatSaverMap = {
  map: typeof BeatSaberPlaylistSongItemSchema._type;
  beatsaverMap?: typeof BeatSaverMapResponseSuccessSchema._type | null;
}

export type WithMaps = {
  maps: typeof BeatSaberPlaylistSongItemSchema._type[];
}

export type WithPlaylist = {
  playlist: typeof BeatSaberPlaylistSchema._type;
};

export type WithPlaylists = {
  playlists: typeof BeatSaberPlaylistSchema._type[];
};
