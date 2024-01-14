import { dbEditor } from "@/packages/database-editor/mod.ts";
import { BeatSaberPlaylistSchema } from "@/packages/types/beatsaber-playlist.ts";
import { makeUppercaseMapHash } from "@/packages/types/brands.ts";
import { filterNulls } from "@/packages/utils/filter.ts";

export const fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem = async (playlistId: string) => {
  const item = await dbEditor.BeatSaberPlaylist
    .findByPrimaryIndex("id", playlistId)
    .then(x => x?.flat());
  if (!item) return null;

  // TODO(@Danielduel): most likely this primary lookup could be optimized with actual Kv getMany
  // fix it in the future.
  const songs = (await Promise.all(item.songs
    .map(async hash => await dbEditor.BeatSaberPlaylistSongItem
      .findByPrimaryIndex("hash", makeUppercaseMapHash(hash as string))
      .then(x => x?.flat() ?? null)
    )
  ))
    .filter(filterNulls)

  return {
    ...item,
    songs,
  } satisfies Omit<typeof BeatSaberPlaylistSchema._type, "image">;
};
