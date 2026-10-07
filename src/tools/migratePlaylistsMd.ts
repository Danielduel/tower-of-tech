import { ListTypes, Markdown } from "https://deno.land/x/deno_markdown@v0.2/mod.ts";
import { playlists } from "@/src/tools/migratePlaylists.ts";
import {
  getToTPlaylistSpeedCategory,
  getToTPlaylistTechCategory,
  playlistMapping,
  ToTPlaylistMappingItem,
} from "@/packages/playlist/collections/tower-of-tech/mod.ts";
import { existsSync } from "@std/fs";
import { kofi, mdImg } from "@/src/tools/mdUtil.ts";
import { BeatSaverApi } from "@/packages/api-beatsaver/api.ts";
import { makeLowercaseMapHash } from "@/packages/types/brands.ts";
import { fetchFromHashResolvables, fetchHashes } from "@/packages/api-beatsaver/mod.ts";
import { BeatSaverResolvableHashKind } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { fetchAndCacheFromResolvablesRaw } from "@/packages/api-beatsaver/mod.ts";

type Playlist = typeof playlists[number]["playlist"];
type Song = Playlist["songs"][number];

const renderSong = (parentMarkdown: Markdown, mapping: ToTPlaylistMappingItem, playlist: Playlist, song: Song) => {
  const img = mdImg(`https://cfcdn.beatsaver.com/${song.hash.toLowerCase()}.jpg`, 150);

  const mapDetails = `<b>Title:</b> ${song.songName}<br>` +
                    `<b>Mapper:</b> ${song.levelAuthorName}`;

  const diffDetails = [
    ...(song.difficulties ?? []).map((diff) => `<pre>${diff.characteristic} ${diff.name}</pre>`),
  ]
    .map((label) => `<b>${label}</b>`)
    .join("<br>");

  const requestLabel = song.key ? `<pre>!bsr ${song.key}</pre>` : `Song is missing/reuploaded on BeatSaver`;

  return [
    img,
    mapDetails,
    diffDetails,
    requestLabel
  ];
};

const renderPlaylist = async (mapping: ToTPlaylistMappingItem, playlist: Playlist) => {
  const markdown = new Markdown();

  const coverImg = mdImg(`/migrated/covers/${mapping.displayName}.png`, 200);
  const title = `Title: ${playlist.playlistTitle}`;
  const complexity = `Complexity: ${getToTPlaylistTechCategory(mapping.techCategory)}`;
  const speed = `Speed: ${getToTPlaylistSpeedCategory(mapping.speedCategory)}`;
  const fileName = `File name: ${mapping.fileName}`;
  const items = `Items: ${playlist.songs.length}`;
  const download = `<a href="${mapping.path}${mapping.fileName}" download>Download</a>`
  const preview = `<a href="${mapping.path}${mapping.fileName}">Preview raw</a>`

  const details = [
    title,
    complexity,
    speed,
    fileName,
    items,
  ].join("<br>")

  const actions = [
    download,
    preview
  ].join("<br>");


  markdown
    .header(`${playlist.playlistTitle}`, 1)
    .table([["", "Details", "Actions", ""], [coverImg, details, actions, kofi]])
    .header(`Maps`, 2)


  const tableHeader = [
    "Cover",
    "Song details",
    "Suggested Difficulty",
    "Request"
  ];

  const table = [tableHeader];

  const hashes = playlist.songs.map((song) => makeLowercaseMapHash(song.hash));
  const resolvables = hashes.map((hash) =>
    ({
      kind: "hash",
      diffs: [],
      data: hash,
    }) as BeatSaverResolvableHashKind
  );

  const response = await fetchFromHashResolvables(resolvables);
  const responseItems = Object.values(response);
  playlist.songs.forEach((song) => {
    const item = responseItems.find((x) => x.versions.some((v) => v.hash === makeLowercaseMapHash(song.hash)));
    if (item) {
      console.log(item.id);
      song.key = item.id;
    }
    table.push(renderSong(markdown, mapping, playlist, song));
  });

  markdown.table(table)

  return markdown;
};

const pathMd = `./migrated/playlists-md/`;
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

