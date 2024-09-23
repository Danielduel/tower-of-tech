import { BeatSaberPlaylistSongItemDifficulty } from "@/src/types/BeatSaberPlaylist.d.ts";

export const difficultyEquals = (
  diff1: BeatSaberPlaylistSongItemDifficulty,
  diff2: BeatSaberPlaylistSongItemDifficulty,
) => diff1.characteristic === diff2.characteristic && diff1.name === diff2.name;
