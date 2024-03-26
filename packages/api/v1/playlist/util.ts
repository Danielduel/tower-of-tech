export const playlistIdWithFileExtensionToPlaylistId = (
  playlistIdWithFileExtension: string,
) => {
  return playlistIdWithFileExtension
    .split(".bplist")[0]
    .split(".json")[0];
};
