import { BeatSaberPlaylistSchema } from "@/packages/types/beatsaber-playlist.ts";

export const getPlaylistFileNameFromPlaylist = (
  playlist: Pick<
    typeof BeatSaberPlaylistSchema._type,
    "customData" | "playlistTitle" | "playlistAuthor"
  >,
) => {
  const sortString =
    playlist.customData && typeof playlist.customData.sort !== "undefined"
      ? `${playlist.customData.sort} - `
      : "";

  return `${sortString}${playlist.playlistTitle} by ${playlist.playlistAuthor}.bplist`;
};
