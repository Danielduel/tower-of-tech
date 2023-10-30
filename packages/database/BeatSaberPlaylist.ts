import { TableDefinition } from "pentagon";
import {
  BeatSaberPlaylistFlatSchema,
  BeatSaberPlaylistSongItemSchema,
} from "@/types/beatsaber-playlist.ts";

export const BeatSaberPlaylistSongItem = {
  schema: BeatSaberPlaylistSongItemSchema,
} satisfies TableDefinition<typeof BeatSaberPlaylistSongItemSchema.shape>;

export const BeatSaberPlaylist = {
  schema: BeatSaberPlaylistFlatSchema,
  relations: {
    songs: [
      "BeatSaberPlaylistSongItem",
      [BeatSaberPlaylistSongItemSchema],
      "songs",
      "hash",
    ],
  },
} satisfies TableDefinition<typeof BeatSaberPlaylistFlatSchema.shape>;
