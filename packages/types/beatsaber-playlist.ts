import { z } from "zod";
import { makeBeatSaverMapId } from "@/packages/types/beatsaver.ts";
import { BeatSaberDifficultyCharacteristicSchema, BeatSaberDifficultyNameSchema } from "@/packages/types/beatsaber.ts";
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
export type BeatSaberPlaylistSongItemDifficultySchemaT = typeof BeatSaberPlaylistSongItemDifficultySchema._type;

export const BeatSaberPlaylistSongItemMetadataSchema = z.object({
  id: z.string(),
  playlistId: z.string().transform(makePlaylistId),
  mapHash: z.string().transform(makeUppercaseMapHash),
  difficulties: z.array(BeatSaberPlaylistSongItemDifficultySchema).optional(),
});
export type BeatSaberPlaylistSongItemMetadataSchemaT = typeof BeatSaberPlaylistSongItemMetadataSchema._type;

export const BeatSaberPlaylistSongItemSchema = z.object({
  hash: z.string().transform(makeUppercaseMapHash),
  levelid: z.string().transform(makeUppercaseMapHashForLevelId).optional(),
  key: z.string().transform(makeBeatSaverMapId).optional(),
  songName: z.string(),
  levelAuthorName: z.string().optional(),
  difficulties: z.array(BeatSaberPlaylistSongItemDifficultySchema).optional(),
});
export type BeatSaberPlaylistSongItemSchemaT = typeof BeatSaberPlaylistSongItemSchema._type;

export const BeatSaberPlaylistCustomDataSchema = z.object({
  AllowDuplicates: z.boolean().optional(),
  syncURL: z.string().transform(makePlaylistUrl).optional(),
  sort: z.number().min(0, "Sort has to be higherequal 0").max(
    12312312312124124,
    "Sort has to be lowerequal 12312312312124124",
  ).int("Sort has to be an integer").optional(),
  owner: z.string().optional(),
  public: z.boolean().optional().default(false),
  private: z.boolean().optional().default(false),
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
export type BeatSaberPlaylistWithoutIdSchemaT = typeof BeatSaberPlaylistWithoutIdSchema._type;

export const BeatSaberPlaylistWithoutIdAndImageSchema = z.object({
  id: z.any().optional(),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(BeatSaberPlaylistSongItemSchema),
  image: z.any().optional(),
});

export const BeatSaberPlaylistSchema = z.object({
  id: z.string().transform(makePlaylistId),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(BeatSaberPlaylistSongItemSchema),
  image: z.string().transform(makeImageBase64),
});
export type BeatSaberPlaylistSchemaT = typeof BeatSaberPlaylistSchema._type;

export const BeatSaberPlaylistWithImageAsUrlSchema = z.object({
  id: z.string().transform(makePlaylistId),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(BeatSaberPlaylistSongItemSchema),
  imageUrl: z.string().transform(makeImageUrl),
});

export const BeatSaberPlaylistFlatWithImageAsUrlSchema = z.object({
  id: z.string().transform(makePlaylistId),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
  customData: BeatSaberPlaylistCustomDataSchema.optional(),
  songs: z.array(z.string().transform(makeUppercaseMapHash)),
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
export type BeatSaberPlaylistFlatSchemaT = typeof BeatSaberPlaylistFlatSchema._type;

export const BeatSaberPlaylistLinkSchema = z.object({
  id: z.string().transform(makePlaylistId),
  playlistTitle: z.string(),
  playlistAuthor: z.string(),
});
