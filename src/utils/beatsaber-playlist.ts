import type { BeatSaberPlaylist } from "../types/BeatSaberPlaylist.d.ts";

const parseAsPlaylist = () => {
  
}

export const fixPlaylistHashes = (playlist: BeatSaberPlaylist) => {
  const clonedPlaylist: BeatSaberPlaylist = structuredClone(playlist);

  clonedPlaylist.songs = clonedPlaylist.songs.map(song => {
    const fixedHash = song.hash.toUpperCase();
    return {
      ...song,
      hash: fixedHash,
      levelid: `custom_level_${fixedHash}`
    };
  })

  return clonedPlaylist;
}