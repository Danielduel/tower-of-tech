import { z } from "zod";
import { BeatSaberDifficultyCharacteristicSchema, BeatSaberDifficultyNameSchema } from "./beatsaber.ts";
import { makeUppercaseMapHashForLevelId, makeUppercaseMapHash, makePlaylistUrl, makeImageBase64, makeImageUrl } from "./brands.ts";
import { makeBeatSaverMapId } from "./beatsaver.ts";

export const BeatSaberPlaylistSongItemDifficultySchema = z.object({
  characteristic: BeatSaberDifficultyCharacteristicSchema,
  name: BeatSaberDifficultyNameSchema
});

export const BeatSaberPlaylistSongItemSchema = z.object({
  hash: z.string().transform(makeUppercaseMapHash).describe("primary"),
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
  id: z.string().describe("primary"),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(z.string().transform(makeUppercaseMapHash)),
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