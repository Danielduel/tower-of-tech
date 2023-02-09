import { decode, Image, TextLayout } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import { fromUint8Array } from "https://denopkg.com/chiefbiiko/base64/mod.ts";
import type { BeatSaberPlaylist, BeatSaberPlaylistSongItem, BeatSaberPlaylistSongItemDifficulty } from "../types/BeatSaberPlaylist.d.ts";

const fontPath = new URL(import.meta.resolve("../../assets/font.ttf")).pathname;
const font = Deno.readFileSync(fontPath);
const textLayout = new TextLayout({
  horizontalAlign: "middle",
  verticalAlign: "center",
})

const sourcePath = new URL(import.meta.resolve("../../data/playlists")).pathname;
const destinationPath = new URL(import.meta.resolve("../../migrated/playlists")).pathname;
const dirListing = [...Deno.readDirSync(sourcePath)]
  .filter(item => item.isFile)

const size = 512;
const cornerPx = size * 212 / 512;
const textPx = size * 350 / 512;
const fontPx = size * 128 / 512;
const imageData = Deno.readFileSync(new URL(import.meta.resolve("../../assets/cover.jpg")).pathname);
const imageBase = ((await decode(imageData)) as Image)
  .resize(size, size)
  .roundCorners(cornerPx);

const getImageBase64 = async (coverLabel: string) => {
  const textImage = Image.renderText(font, fontPx, coverLabel, 0x000000ff, textLayout);
  const image = imageBase.composite(textImage, textPx, textPx);
  const pngEncode = await image.encode();

  Deno.writeFileSync("./image.png", pngEncode);

  const pngBase64 = fromUint8Array(pngEncode);
  return `base64,${pngBase64}`;
}

const allCoverBase64 = await getImageBase64("*");

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
    syncURL: "https://raw.githubusercontent.com/Danielduel/tower-of-tech/main/migrated/ToT_-_all.bplist"
  }
}

const allMapsPlaylistJson = JSON.stringify(allMapsPlaylist);
Deno.writeTextFileSync(destinationPath + "/" + "ToT_-_all.bplist", allMapsPlaylistJson);
