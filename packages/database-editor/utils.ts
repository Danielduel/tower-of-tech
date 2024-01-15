import { dbEditor } from "@/packages/database-editor/mod.ts";
import { BeatSaberPlaylistSchema } from "@/packages/types/beatsaber-playlist.ts";

export const fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem = async (
  playlistId: string,
) => {
  const item = await dbEditor.BeatSaberPlaylist
    .find(playlistId)
    .then((x) => x?.flat());
  if (!item) return null;

  const songs = await dbEditor.BeatSaberPlaylistSongItem
    .findMany(item.songs)
    .then((x) => x.map((x) => x.flat()));

  return {
    ...item,
    songs,
  } satisfies Omit<typeof BeatSaberPlaylistSchema._type, "image">;
};
