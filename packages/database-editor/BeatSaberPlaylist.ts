import { collection } from "kvdex/mod.ts";
import { zodModel } from "kvdex/ext/zod.ts";
import { z } from "zod";
import {
  BeatSaberPlaylistCustomDataSchema,
  BeatSaberPlaylistSongItemSchema,
} from "@/packages/types/beatsaber-playlist.ts";

import { KvIdSchema } from "kvdex/ext/zod.ts";

export const BeatSaberPlaylistFlatSchema = z.object({
  id: z.string(),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(KvIdSchema),
  image: z.null(),
});

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
