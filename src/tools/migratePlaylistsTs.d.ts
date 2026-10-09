import type { playlists } from "@/src/tools/migratePlaylists.ts";
import { LowercaseMapHash } from "@/packages/types/brands.ts";
import { BeatSaverResolvable } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { BeatSaverMapId } from "@/packages/types/beatsaver.ts";
import { BeatSaberPlaylistSongItemSchemaT } from "@/packages/types/beatsaber-playlist.ts";
import { BeatSaverMapResponseSuccessSchema } from "@/packages/types/beatsaver.ts";
import { ToTPlaylistMappingItem } from "@/packages/playlist/collections/tower-of-tech/mod.ts";

export type MigratePlaylistsTsTypeResolvedSong = {
  key?: BeatSaverMapId;
  song: BeatSaberPlaylistSongItemSchemaT;
  beatsaver: typeof BeatSaverMapResponseSuccessSchema._type;
  hash: LowercaseMapHash;
};

export type MigratePlaylistsTsType = {
  mapping: ToTPlaylistMappingItem;
  playlist: typeof playlists[number]["playlist"];
  coverUrl: string;
  displayComplexity?: string;
  displaySpeed?: string;
  songsCount: number;
  repositoryUrl: string;
  hashes: LowercaseMapHash[];
  resolvables: BeatSaverResolvable[];
  resolvedSongs: MigratePlaylistsTsTypeResolvedSong[];
};

