import type { BeatSaberDifficultyCharacteristic, BeatSaberDifficultyName } from "./BeatSaber.d.ts";

export type BeatSaberPlaylistSongItemDifficulty = {
  characteristic: BeatSaberDifficultyCharacteristic;
  name: BeatSaberDifficultyName;
};

export type BeatSaberPlaylistSongItem = {
  hash: string;
  levelid: string;
  key?: string;
  songName: string;
  levelAuthorName: string;
  difficulties: BeatSaberPlaylistSongItemDifficulty[];
};

export type BeatSaberPlaylistCustomData = {
  AllowDuplicates?: boolean;
  syncURL?: string;
  owner?: string;
  id?: string;
}

export type BeatSaberPlaylist = {
  playlistTitle: string;
  playlistAuthor: string;
  customData?: BeatSaberPlaylistCustomData;
  songs: BeatSaberPlaylistSongItem[];
  image: string;
}
