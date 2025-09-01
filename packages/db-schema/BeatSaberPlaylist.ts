import { collection } from "@/packages/deps/kvdex.ts";
import {
  BeatSaberPlaylistFlatSchema,
  BeatSaberPlaylistSongItemMetadataSchema,
  BeatSaberPlaylistSongItemSchema,
} from "@/packages/types/beatsaber-playlist.ts";
import { getBeatSaberPlaylistSongItemMetadataKey } from "./keys.ts";

export const BeatSaberPlaylistSongItem = collection(
  BeatSaberPlaylistSongItemSchema,
  {
    idGenerator: (item) => item.hash,
    history: true,
    indices: {
      key: "secondary",
    },
  },
);

export const BeatSaberPlaylist = collection(
  BeatSaberPlaylistFlatSchema,
  {
    idGenerator: (item) => item.id,
    history: true,
  },
);

export const BeatSaberPlaylistSongItemMetadata = collection(
  BeatSaberPlaylistSongItemMetadataSchema,
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
