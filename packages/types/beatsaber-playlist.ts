import { z } from "zod";
import { makeBeatSaverMapId } from "@/packages/types/beatsaver.ts";
import {
  BeatSaberDifficultyCharacteristicSchema,
  BeatSaberDifficultyNameSchema,
} from "@/packages/types/beatsaber.ts";
import {
  makeImageBase64,
  makeImageUrl,
  makePlaylistUrl,
  makeUppercaseMapHash,
  makeUppercaseMapHashForLevelId,
} from "@/packages/types/brands.ts";
import { makePlaylistId } from "@/packages/types/brands.ts";

export const BeatSaberPlaylistSongItemDifficultySchema = z.object({
  characteristic: BeatSaberDifficultyCharacteristicSchema,
  name: BeatSaberDifficultyNameSchema,
});

export const BeatSaberPlaylistSongItemSchema = z.object({
  hash: z.string().transform(makeUppercaseMapHash),
  levelid: z.string().transform(makeUppercaseMapHashForLevelId),
  key: z.string().transform(makeBeatSaverMapId).optional(),
  songName: z.string(),
  levelAuthorName: z.string(),
  difficulties: z.array(BeatSaberPlaylistSongItemDifficultySchema),
});

export const BeatSaberPlaylistCustomDataSchema = z.object({
  AllowDuplicates: z.boolean().optional(),
  syncURL: z.string().transform(makePlaylistUrl).optional(),
  owner: z.string().optional(),
  id: z.string().optional(),
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
  id: z.string().transform(makePlaylistId),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(BeatSaberPlaylistSongItemSchema),
  image: z.string().transform(makeImageBase64),
});

export const BeatSaberPlaylistWithImageAsUrlSchema = z.object({
  id: z.string().transform(makePlaylistId),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(BeatSaberPlaylistSongItemSchema),
  imageUrl: z.string().transform(makeImageUrl),
});

export const BeatSaberPlaylistFlatSchema = z.object({
  id: z.string().transform(makePlaylistId),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(z.string().transform(makeUppercaseMapHash)),
  image: z.null(),
});

export const BeatSaberPlaylistLinkSchema = z.object({
  id: z.string().transform(makePlaylistId),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
});
