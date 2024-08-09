import { PlaylistId, UppercaseMapHash } from "@/packages/types/brands.ts";

export const getBeatSaberPlaylistSongItemMetadataKey = (playlistId: PlaylistId, mapHash: UppercaseMapHash) =>
  `${playlistId}-${mapHash}`;
