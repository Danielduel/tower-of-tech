import { collection } from "kvdex/mod.ts";
import { zodModel } from "kvdex/ext/zod.ts";
import {
  BeatSaberPlaylistFlatSchema,
  BeatSaberPlaylistSongItemMetadataSchema,
  BeatSaberPlaylistSongItemSchema,
} from "@/packages/types/beatsaber-playlist.ts";
import { getBeatSaberPlaylistSongItemMetadataKey } from "@/packages/database-editor/keys.ts";

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

export const BeatSaberPlaylistSongItemMetadata = collection(
  zodModel(BeatSaberPlaylistSongItemMetadataSchema),
  {
    indices: {
      id: "primary",
      mapHash: "secondary",
      playlistId: "secondary",
    },
    idGenerator: (item) => getBeatSaberPlaylistSongItemMetadataKey(item.playlistId, item.mapHash),
    history: true,
  },
);
