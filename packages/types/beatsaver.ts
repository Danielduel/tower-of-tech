import { z } from "zod";
import { Brand, make } from "@/packages/deps/brand.ts";

import { BeatSaberDifficultyCharacteristicSchema, BeatSaberDifficultyNameSchema } from "@/packages/types/beatsaber.ts";
import {
  makeDateString,
  makeImageUrl,
  makeLowercaseMapHash,
  makeMapdataUrl,
  makePlaylistUrl,
  makePreviewUrl,
} from "@/packages/types/brands.ts";

export type BeatSaverUserId = Brand<number, "BeatSaverUserId">;
export const makeBeatSaverUserId = make<BeatSaverUserId>();

export type BeatSaverMapId = Brand<string, "BeatSaverMapId">;
export const makeBeatSaverMapId = (id: string) => make<BeatSaverMapId>()(id.toLowerCase());
export const beatSaverMapIdSchema = z.string().transform(makeBeatSaverMapId);

export const BeatSaverResponseWrapperSchema = z.object({
  id: z.string().transform(makeBeatSaverMapId),
  createdAt: z.date(),
  available: z.boolean(),
  removed: z.boolean(),
});
export type BeatSaverResponseWrapperSchemaT = typeof BeatSaverResponseWrapperSchema._type;

export const BeatSaverMapResponseUploader = z.object({
  id: z.number().transform(makeBeatSaverUserId),
  name: z.string(),
  avatar: z.string().transform(makeImageUrl),
  type: z.string(),
  admin: z.boolean(),
  curator: z.boolean(),
  playlistUrl: z.string().transform(makePlaylistUrl),
});

export const BeatSaverMapResponseMetadata = z.object({
  bpm: z.number(),
  duration: z.number(),
  songName: z.string(),
  songSubName: z.string(),
  songAuthorName: z.string(),
  levelAuthorName: z.string(),
});

export const BeatSaverMapResponseStats = z.object({
  plays: z.number(),
  downloads: z.number(),
  upvotes: z.number(),
  downvotes: z.number(),
  score: z.number().min(0).max(1),
});

const BeatSaverMapResponseVersionsItemState = z.enum([
  "Published",
]);

export const BeatSaverMapResponseVersionsItemDiffItemParitySummary = z.object({
  error: z.number().optional(),
  warns: z.number().optional(),
  resets: z.number().optional(),
});

export const BeatSaverMapResponseVersionsItemDiffItem = z.object({
  njs: z.number(),
  offset: z.number(),
  notes: z.number(),
  bombs: z.number(),
  obstacles: z.number(),
  nps: z.number(),
  length: z.number(),
  characteristic: BeatSaberDifficultyCharacteristicSchema,
  difficulty: BeatSaberDifficultyNameSchema,
  events: z.number(),
  chroma: z.boolean(),
  me: z.boolean(),
  ne: z.boolean(),
  cinema: z.boolean(),
  seconds: z.number(),
  paritySummary: BeatSaverMapResponseVersionsItemDiffItemParitySummary,
  maxScore: z.number(),
  label: z.string().optional(),
});

export const BeatSaverMapResponseVersionsItem = z.object({
  hash: z.string().transform(makeLowercaseMapHash),
  state: BeatSaverMapResponseVersionsItemState,
  createdAt: z.string().transform(makeDateString),
  sageScore: z.number().optional(),
  diffs: z.array(BeatSaverMapResponseVersionsItemDiffItem),
  downloadURL: z.string().transform(makeMapdataUrl),
  coverURL: z.string().transform(makeImageUrl),
  previewURL: z.string().transform(makePreviewUrl),
});

export const BeatSaverMapResponseNotFoundSchema = z.object({
  error: z.enum(["Not Found"]),
});

export const BeatSaverMapResponseSuccessSchema = z.object({
  id: z.string().transform(makeBeatSaverMapId),
  name: z.string(),
  description: z.string(),
  uploader: BeatSaverMapResponseUploader,
  metadata: BeatSaverMapResponseMetadata,
  stats: BeatSaverMapResponseStats,
  uploaded: z.string().transform(makeDateString),
  automapper: z.boolean(),
  ranked: z.boolean(),
  qualified: z.boolean(),
  versions: z.array(BeatSaverMapResponseVersionsItem),
  createdAt: z.string().transform(makeDateString),
  updatedAt: z.string().transform(makeDateString),
  lastPublishedAt: z.string().transform(makeDateString),
  tags: z.array(z.string()).optional(),
  bookmarked: z.boolean().optional(),
});

export const BeatSaverIdToHashCacheSchema = z.object({
  id: z.string().transform(makeBeatSaverMapId).describe("primary"),
  hash: z.string().transform(makeLowercaseMapHash).optional(),
  available: z.boolean(),
  removed: z.boolean().optional(),
  outdated: z.boolean(),
});
export type BeatSaverIdToHashCacheSchemaT = typeof BeatSaverIdToHashCacheSchema._type;

export const BeatSaverMapResponseSchema = z.union(
  [BeatSaverMapResponseSuccessSchema, BeatSaverMapResponseNotFoundSchema],
);

export const BeatSaverMapByHashResponseSchema = z.record(
  z.string().regex(/[0-9a-f,]+/),
  z.nullable(BeatSaverMapResponseSuccessSchema),
);

export const BeatSaverMapByIdResponseSchema = z.record(
  z.string().regex(/[0-9a-f,]+/),
  z.nullable(BeatSaverMapResponseSuccessSchema),
);

export const isBeatSaverMapResponseSuccessSchema = (
  x: typeof BeatSaverMapResponseSchema._type,
): x is typeof BeatSaverMapResponseSuccessSchema._type => {
  return "versions" in x;
};

export const isBeatSaverMapResponseNotFoundSchema = (
  x: typeof BeatSaverMapResponseSchema._type,
): x is typeof BeatSaverMapResponseNotFoundSchema._type => {
  return "error" in x;
};
