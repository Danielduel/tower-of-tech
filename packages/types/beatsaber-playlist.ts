import { z } from "zod";
import { makeBeatSaverMapId } from "@/packages/types/beatsaver.ts";
import { BeatSaberDifficultyCharacteristicSchema, BeatSaberDifficultyNameSchema } from "@/packages/types/beatsaber.ts";
import { makeUppercaseMapHashForLevelId, makeUppercaseMapHash, makePlaylistUrl, makeImageBase64, makeImageUrl } from "@/packages/types/brands.ts";
import { KvIdSchema } from "kvdex/ext/zod.ts";

export const BeatSaberPlaylistSongItemDifficultySchema = z.object({
  characteristic: BeatSaberDifficultyCharacteristicSchema,
  name: BeatSaberDifficultyNameSchema
});

export const BeatSaberPlaylistSongItemSchema = z.object({
  hash: z.string().transform(makeUppercaseMapHash),
  levelid: z.string().transform(makeUppercaseMapHashForLevelId),
  key: z.string().transform(makeBeatSaverMapId).optional(),
  songName: z.string(),
  levelAuthorName: z.string(),
  difficulties: z.array(BeatSaberPlaylistSongItemDifficultySchema)
});

export const BeatSaberPlaylistCustomDataSchema = z.object({
  AllowDuplicates: z.boolean().optional(),
  syncURL: z.string().transform(makePlaylistUrl).optional(),
  owner: z.string().optional(),
  id: z.string().optional(),
});

export const BeatSaberPlaylistFlatSchema = z.object({
  id: z.string(),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(KvIdSchema),
  image: z.null(),
});

export const BeatSaberPlaylistWithoutIdSchema = z.object({
  id: z.any(),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(BeatSaberPlaylistSongItemSchema),
  image: z.string().transform(makeImageBase64),
});

export const BeatSaberPlaylistSchema = z.object({
  id: z.string().describe("primary"),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(BeatSaberPlaylistSongItemSchema),
  image: z.string().transform(makeImageBase64),
});

export const BeatSaberPlaylistWithImageAsUrlSchema = z.object({
  id: z.string().describe("primary"),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(BeatSaberPlaylistSongItemSchema),
  imageUrl: z.string().transform(makeImageUrl),
});

export const BeatSaberPlaylistLinkSchema = z.object({
  id: z.string().describe("primary"),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
});