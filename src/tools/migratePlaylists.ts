
import type { BeatSaberPlaylist, BeatSaberPlaylistSongItem, BeatSaberPlaylistSongItemDifficulty } from "../types/BeatSaberPlaylist.d.ts";
import { getCoverBase64 } from "../utils/cover-image.ts";
import { stringify } from "../utils/json.ts";

const sourcePath = new URL(import.meta.resolve("../../data/playlists")).pathname;
const destinationPath = new URL(import.meta.resolve("../../migrated/playlists")).pathname;
const dirListing = [...Deno.readDirSync(sourcePath)]
  .filter(item => item.isFile)

const allCoverBase64 = await getCoverBase64("*");

const playlists = dirListing.flatMap(file => {
  const playlistRaw = Deno.readTextFileSync(sourcePath + "/" + file.name);
  const playlist = JSON.parse(playlistRaw) as BeatSaberPlaylist;
  return playlist;
});

const mergedMaps = playlists.flatMap((playlist) => {
  return playlist.songs;
});

const playlistItems: Record<string, BeatSaberPlaylistSongItem[]> = {};

mergedMaps.forEach(item => {
  if (!playlistItems[item.hash]) playlistItems[item.hash] = [];

  playlistItems[item.hash].push(item);
})

Object
  .entries(playlistItems)
  .filter(([_, arr]) => arr.length > 1)
  .forEach(([key, arr]) => {
    const mergedStringDiffs = arr
      .flatMap(item => item.difficulties)
      .map(diff => `${diff.characteristic}:${diff.name}`);
    const difficulties = [...new Set(mergedStringDiffs)].map(stringDiff => {
      const [characteristic, name] = stringDiff.split(":");
      return { characteristic, name } as BeatSaberPlaylistSongItemDifficulty;
    })
    playlistItems[key] = [ { ...arr[0], difficulties } ];
  });

const allMaps = Object.values(playlistItems).flatMap(x => x);
const allMapsPlaylist: BeatSaberPlaylist = {
  image: allCoverBase64,
  playlistAuthor: "Danielduel",
  playlistTitle: "ToT - *",
  songs: allMaps,
  customData: {
    AllowDuplicates: false,
    id: "Tower of Tech",
    owner: "Danielduel",
    syncURL: "https://raw.githubusercontent.com/Danielduel/tower-of-tech/main/migrated/playlists/ToT_-_all.bplist"
  }
}

const allMapsPlaylistJson = stringify(allMapsPlaylist);
Deno.writeTextFileSync(destinationPath + "/" + "ToT_-_all.bplist", allMapsPlaylistJson);
