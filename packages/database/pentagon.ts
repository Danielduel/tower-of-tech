import { createPentagon as _createPentagon } from "pentagon";
import {
  BeatSaberPlaylist,
  BeatSaberPlaylistSongItem,
} from "@/packages/database/BeatSaberPlaylist.ts";
import {
  BeatSaverMapResponseSuccess,
  BeatSaverResponseWrapper,
} from "@/packages/database/BeatSaverResponse.ts";

export const createPentagon = (kv: Deno.Kv) => {
  return _createPentagon(kv, {
    BeatSaverResponseWrapper,
    BeatSaverMapResponseSuccess,
    BeatSaberPlaylist,
    BeatSaberPlaylistSongItem,
  });
};
