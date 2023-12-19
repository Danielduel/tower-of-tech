import { createPentagon as _createPentagon } from "pentagon";
import {
  BeatSaberPlaylist,
  BeatSaberPlaylistSongItem,
} from "./BeatSaberPlaylist.ts";
import {
  BeatSaverMapResponseSuccess,
  BeatSaverResponseWrapper,
} from "./BeatSaverResponse.ts";

export const createPentagon = (kv: Deno.Kv) => {
  return _createPentagon(kv, {
    BeatSaverResponseWrapper,
    BeatSaverMapResponseSuccess,
    BeatSaberPlaylist,
    BeatSaberPlaylistSongItem,
  });
};
