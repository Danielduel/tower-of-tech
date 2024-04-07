import {
  BeatSaberPlaylistCustomDataSchema,
  BeatSaberPlaylistSchema,
} from "@/packages/types/beatsaber-playlist.ts";

type GetPlaylistFileNameFromPlaylist = {
  playlistTitle: typeof BeatSaberPlaylistSchema._type["playlistTitle"];
  playlistAuthor: typeof BeatSaberPlaylistSchema._type["playlistAuthor"];
  customData?: {
    [x: string]: unknown;
    sort?: typeof BeatSaberPlaylistCustomDataSchema._type["sort"];
  };
};

export const getPlaylistFileNameFromPlaylist = (
  playlist: GetPlaylistFileNameFromPlaylist,
) => {
  const sortString =
    playlist.customData && typeof playlist.customData.sort !== "undefined"
      ? `${playlist.customData.sort} - `
      : "";

  return `${sortString}${playlist.playlistTitle} by ${playlist.playlistAuthor}.bplist`;
};
