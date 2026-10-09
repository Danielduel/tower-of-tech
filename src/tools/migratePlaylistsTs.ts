import { playlists } from "@/src/tools/migratePlaylists.ts";
import {
  getToTPlaylistSpeedCategory,
  getToTPlaylistTechCategory,
  playlistMapping,
  ToTPlaylistMappingItem,
} from "@/packages/playlist/collections/tower-of-tech/mod.ts";
import { existsSync } from "@std/fs";
import { makeLowercaseMapHash } from "@/packages/types/brands.ts";
import { fetchFromHashResolvables } from "@/packages/api-beatsaver/mod.ts";
import { BeatSaverResolvableHashKind } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { towerOfTechRepositoryUrl } from "@/packages/utils/constants.ts";
import { MigratePlaylistsTsType, MigratePlaylistsTsTypeResolvedSong } from "@/src/tools/migratePlaylistsTs.d.ts";

type Playlist = typeof playlists[number]["playlist"];

const renderPlaylist = async (mapping: ToTPlaylistMappingItem, playlist: Playlist) => {
  const coverUrl =  `${towerOfTechRepositoryUrl}/migrated/covers/${mapping.displayName}.png`;
  const displayComplexity = getToTPlaylistTechCategory(mapping.techCategory);
  const displaySpeed = getToTPlaylistSpeedCategory(mapping.speedCategory);
  const songsCount = playlist.songs.length;
  const repositoryUrl = `${towerOfTechRepositoryUrl}${mapping.path}${mapping.fileName}`;

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
  const resolvedSongs = playlist.songs.map((song): MigratePlaylistsTsTypeResolvedSong => {
    const item = responseItems.find((x) => x.versions.some((v) => v.hash === makeLowercaseMapHash(song.hash)));

    return {
      key: item?.id,
      song,
      beatsaver: item!, // todo move to optional
      hash: makeLowercaseMapHash(song.hash)
    };
  });

  return {
    mapping,
    playlist,
    coverUrl,
    displayComplexity,
    displaySpeed,
    songsCount,
    repositoryUrl,
    hashes,
    resolvables,
    resolvedSongs,
  } satisfies MigratePlaylistsTsType;
};

const pathTs = `./migrated/playlists-ts/`;
if (existsSync(pathTs)) {
  Deno.removeSync(pathTs, { recursive: true });
}
Deno.mkdirSync(pathTs, { recursive: true });
const promises = Object.values(playlistMapping)
  .map(async (mapping) => {
    const playlist = playlists.find((x) => x.playlist.customData!.id === mapping.playlistId);
    const content = await renderPlaylist(mapping, playlist!.playlist);
    Deno.writeTextFileSync(`${pathTs}${mapping.displayName}.ts`, `
import { MigratePlaylistsTsType } from "@/src/tools/migratePlaylistsTs.d.ts";
export default ${JSON.stringify(content, undefined, 2)} satisfies MigratePlaylistsTsType;
`);
  });
await Promise.all(promises);

