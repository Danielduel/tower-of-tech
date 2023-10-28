import { TableDefinition } from "https://deno.land/x/pentagon@v0.1.4/mod.ts";
import {
  BeatSaberPlaylistSchema,
  BeatSaberPlaylistSongItemSchema,
} from "@/types/beatsaber-playlist.ts";

export const BeatSaberPlaylistSongItem = {
  schema: BeatSaberPlaylistSongItemSchema,
} satisfies TableDefinition;

export const BeatSaberPlaylist = {
  schema: BeatSaberPlaylistSchema,
  relations: {
    songs: [
      "BeatSaberPlaylistSongItem",
      [BeatSaberPlaylistSongItemSchema],
      undefined!,
      "hash",
    ],
  },
} satisfies TableDefinition;
