import {
  BeatSaberPlaylistSongItemDifficultySchemaT,
  BeatSaberPlaylistWithoutIdSchemaT,
} from "@/packages/types/beatsaber-playlist.ts";
import { UppercaseMapHash } from "@/packages/types/brands.ts";
import { difficultyEquals } from "@/packages/utils/difficultyEquals.ts";

type RemovePlaylistItemDuplicatesItem = {
  difficulties?: BeatSaberPlaylistSongItemDifficultySchemaT[];
  hash: UppercaseMapHash;
};
export function removePlaylistItemDuplicates<T extends RemovePlaylistItemDuplicatesItem>(
  items: T[],
): T[] {
  const out = new Map<UppercaseMapHash, RemovePlaylistItemDuplicatesItem>();

  items.forEach((item) => {
    const key = item.hash;
    const exists = out.has(key);
    if (!exists) {
      out.set(key, item);
    }

    const state = out.get(key)!;

    item.difficulties &&
      item.difficulties.forEach((diff) => {
        if (state.difficulties) {
          const alreadyAdded = state.difficulties.some((stateItem) => difficultyEquals(stateItem, diff));

          if (alreadyAdded) return;

          state.difficulties.push(diff);
        }
      });

    out.set(key, state);
  });

  return [...out.values()] as T[];
}

export function migrateBeatSaberPlaylistWithoutIdSchema(
  zodPlaylist: BeatSaberPlaylistWithoutIdSchemaT,
): BeatSaberPlaylistWithoutIdSchemaT {
  const migratedSongs = removePlaylistItemDuplicates(zodPlaylist.songs);

  return {
    ...zodPlaylist,
    songs: migratedSongs,
  };
}
