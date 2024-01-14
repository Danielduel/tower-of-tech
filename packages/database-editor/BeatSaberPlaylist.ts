import { collection } from "kvdex/mod.ts";
import { zodModel } from "kvdex/ext/zod.ts";
import {
  BeatSaberPlaylistFlatSchema,
  BeatSaberPlaylistSongItemSchema,
} from "@/packages/types/beatsaber-playlist.ts";

export const BeatSaberPlaylistSongItem = collection(
  zodModel(BeatSaberPlaylistSongItemSchema),
  {
    history: true,
    indices: {
      hash: "primary",
      key: "secondary",
    },
  },
);

export const BeatSaberPlaylist = collection(
  zodModel(BeatSaberPlaylistFlatSchema),
  {
    history: true,
    indices: {
      id: "primary",
    },
  },
);
