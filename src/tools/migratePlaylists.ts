
import type { BeatSaberPlaylist, BeatSaberPlaylistSongItem, BeatSaberPlaylistSongItemDifficulty } from "../types/BeatSaberPlaylist.d.ts";
import { getCoverBase64 } from "../utils/cover-image.ts";
import { stringify } from "../utils/json.ts";

const sourcePath = new URL(import.meta.resolve("../../data/playlists")).pathname;
const destinationPath = new URL(import.meta.resolve("../../migrated/playlists")).pathname;
const dirListing = [...Deno.readDirSync(sourcePath)]
  .filter(item => item.isFile)

const migratePlaylist = async (fileName: string, playlistData?: BeatSaberPlaylist) => {
  const playlist = playlistData
    ? playlistData
    : JSON.parse(Deno.readTextFileSync(sourcePath + "/" + fileName)) as BeatSaberPlaylist;

  const longName = fileName
    .split(".bplist")[0];
  const shortName = longName
    .split("ToT - ")
      .pop()!;

  return {
    fileName,
    longName,
    shortName,
    playlist,
    coverBase64: await getCoverBase64(shortName),
  };
}

const playlists = await Promise.all(dirListing.map(file => migratePlaylist(file.name)));
const mergedMaps = playlists.flatMap((playlist) => playlist.playlist.songs);

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
playlists.push(await migratePlaylist("*", {
  image: "",
  playlistAuthor: "Danielduel",
  playlistTitle: "ToT - *",
  songs: allMaps
}))

await Promise.all(playlists.map(async ({
  coverBase64,
  fileName,
  longName,
  playlist,
  shortName
}) => {
  const beatsaberPlaylist: BeatSaberPlaylist = {
    image: coverBase64,
    playlistAuthor: playlist.playlistAuthor,
    playlistTitle: playlist.playlistTitle,
    songs: playlist.songs,
    customData: {
      AllowDuplicates: false,
      id: "Tower of Tech",
      owner: "Danielduel",
      syncURL: new URL(`https://raw.githubusercontent.com/Danielduel/tower-of-tech/main/migrated/playlists/${fileName}`).href
    }
  };
  const beatsaberPlaylistString = stringify(beatsaberPlaylist);
  await Deno.writeTextFile(`${destinationPath}/${fileName}`, beatsaberPlaylistString);
}));
