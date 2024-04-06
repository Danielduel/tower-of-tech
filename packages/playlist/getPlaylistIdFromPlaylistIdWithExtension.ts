import { makePlaylistId } from "@/packages/types/brands.ts";

export const getPlaylistIdFromPlaylistIdWithExtension = (
  playlistIdWithFileExtension: string,
) => {
  const playlistId = playlistIdWithFileExtension
    .split(".bplist")[0]
    .split(".json")[0];

  if (playlistId && playlistId.length === 26) {
    return makePlaylistId(playlistId);
  }

  console.warn(`${playlistId} doesn't look like a playlistId`);

  return makePlaylistId(playlistId);
};
