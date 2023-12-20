import { createPentagon as _createPentagon } from "pentagon";
import {
  BeatSaberPlaylist,
  BeatSaberPlaylistSongItem,
} from "@/packages/database-editor/BeatSaberPlaylist.ts";
import {
  BeatSaverIdToHashCache,
  BeatSaverMapResponseSuccess,
  BeatSaverResponseWrapper,
} from "@/packages/database-editor/BeatSaverResponse.ts";

export const createPentagon = (kv: Deno.Kv) => {
  return _createPentagon(kv, {
    BeatSaverResponseWrapper,
    BeatSaverMapResponseSuccess,
    BeatSaberPlaylist,
    BeatSaberPlaylistSongItem,
    BeatSaverIdToHashCache,
  });
};
