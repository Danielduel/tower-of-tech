import { z } from "zod";
import { makeLowercaseMapHash } from "@/packages/types/brands.ts";
import { makeBeatSaverMapId } from "@/packages/types/beatsaver.ts";

export const BeatSaverResolvableHashKindSchema = z.object({
  kind: z.literal("hash"),
  data: z.string().transform(makeLowercaseMapHash),
});

export const BeatSaverResolvableIdKindSchema = z.object({
  kind: z.literal("id"),
  data: z.string().transform(makeBeatSaverMapId),
});

export const BeatSaverResolvableSchema = z.union([
  BeatSaverResolvableHashKindSchema,
  BeatSaverResolvableIdKindSchema
]);
