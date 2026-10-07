import { ListTypes, Markdown } from "https://deno.land/x/deno_markdown@v0.2/mod.ts";
import { playlists } from "@/src/tools/migratePlaylists.ts";
import {
  getToTPlaylistSpeedCategory,
  getToTPlaylistTechCategory,
  playlistMapping,
  ToTPlaylistMappingItem,
} from "@/packages/playlist/collections/tower-of-tech/mod.ts";
import { existsSync } from "@std/fs";
import { mdImg } from "@/src/tools/mdUtil.ts";
import { BeatSaverApi } from "@/packages/api-beatsaver/api.ts";
import { makeLowercaseMapHash } from "@/packages/types/brands.ts";
import { fetchFromHashResolvables, fetchHashes } from "@/packages/api-beatsaver/mod.ts";
import { BeatSaverResolvableHashKind } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { fetchAndCacheFromResolvablesRaw } from "@/packages/api-beatsaver/mod.ts";

type Playlist = typeof playlists[number]["playlist"];
type Song = Playlist["songs"][number];

const renderSong = (parentMarkdown: Markdown, mapping: ToTPlaylistMappingItem, playlist: Playlist, song: Song) => {
  const img = mdImg(`https://cfcdn.beatsaver.com/${song.hash.toLowerCase()}.jpg`)

  parentMarkdown
    .horizontalRule("---")
    .table([[img, song.songName, song.levelAuthorName, `\`!bsr ${song.key}\``], (song.difficulties ?? []).map(diff => `${diff.characteristic} ${diff.name}`)])
}

const renderPlaylist = async (mapping: ToTPlaylistMappingItem, playlist: Playlist) => {
  const markdown = new Markdown();

  const coverImg = mdImg(`./migrated/covers/${mapping.displayName}.png`);
  const complexity = `Complexity: ${getToTPlaylistTechCategory(mapping.techCategory)}`;
  const speed = `Speed: ${getToTPlaylistSpeedCategory(mapping.speedCategory)}`;

  markdown
    .header(`${playlist.playlistTitle}`, 1)
    .table([[coverImg, complexity, speed]])
    .paragraph(coverImg)
    .paragraph(complexity)
    .paragraph(speed)
    .paragraph(`${complexity}\n${speed}`)

  const hashes = playlist.songs.map(song => makeLowercaseMapHash(song.hash));
  const resolvables = hashes.map(hash => ({
    kind: "hash",
    diffs: [],
    data: hash
  }) as BeatSaverResolvableHashKind)

  const response = await fetchFromHashResolvables(resolvables);
  const responseItems = Object.values(response);
  playlist.songs.forEach(song => {
    const item = responseItems.find(x => x.versions.some(v => v.hash === makeLowercaseMapHash(song.hash)));
    if (item) {
      console.log(item.id);
      song.key = item.id;
    }
    renderSong(markdown, mapping, playlist, song)
  });

  return markdown;
}

const pathMd = `./migrated/playlists-md/` 
if (existsSync(pathMd)) {
  Deno.removeSync(pathMd, { recursive: true });
}
Deno.mkdirSync(pathMd, { recursive: true });
const promises = Object.values(playlistMapping) 
  .map(async (mapping) => {
    const playlist = playlists.find((x) => x.playlist.customData!.id === mapping.playlistId);
    const markdown = await renderPlaylist(mapping, playlist!.playlist);
    Deno.writeTextFileSync(`${pathMd}${mapping.displayName}.md`, markdown.content);
  });
await Promise.all(promises);

//
// const markdown = new Markdown()
// markdown
//   .header(``)
//   .paragraph(
//     `Zip containing all playlists can be found [here](${latestPlaylistReleaseUrl})`,
//   )
//   .table(
//     [
//       ["", "Name", "Pacing", "Complexity", "Items", ""],
//       ...Object
//         .entries(playlistMapping)
//         .map(([mappingKey, mappingValue]) => {
//           const playlist = playlists.find((x) => x.playlist.customData!.id === mappingValue.playlistId);
//           if (!playlist) return ``;
//           return [
//             mdImg(`./migrated/covers/${mappingValue.displayName}.png`),
//             playlist.playlist.playlistTitle,
//             getToTPlaylistSpeedCategory(mappingValue.speedCategory),
//             getToTPlaylistTechCategory(mappingValue.techCategory),
//             playlist.playlist.songs.length,
//             mkActions(mappingValue.path, mappingValue.fileName),
//           ];
//         }),
//     ]
