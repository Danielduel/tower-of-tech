import { collection } from "kvdex/mod.ts";
import { zodModel } from "kvdex/ext/zod.ts";
import {
  BeatSaberPlaylistFlatSchema,
  BeatSaberPlaylistSongItemSchema,
} from "@/packages/types/beatsaber-playlist.ts";

export const BeatSaberPlaylistSongItem = collection(
  zodModel(BeatSaberPlaylistSongItemSchema),
  {
    idGenerator: (item) => item.hash,
    history: true,
    indices: {
      key: "secondary",
    },
  },
);

export const BeatSaberPlaylist = collection(
  zodModel(BeatSaberPlaylistFlatSchema),
  {
    idGenerator: (item) => item.id,
    history: true,
  },
);
