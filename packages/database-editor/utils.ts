import { dbEditor } from "@/packages/database-editor/mod.ts";
import { BeatSaberPlaylistSchema } from "@/packages/types/beatsaber-playlist.ts";

export const fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem = async (playlistId: string) => {
  const item = await dbEditor.BeatSaberPlaylist
    .findByPrimaryIndex("id", playlistId)
    .then(x => x?.flat());
  if (!item) return null;

  const songs = await dbEditor.BeatSaberPlaylistSongItem
    .findMany(item.songs)
    .then(x => x.map(y => y.flat()))

  return {
    ...item,
    songs
  } satisfies Omit<typeof BeatSaberPlaylistSchema._type, "image">;
};
