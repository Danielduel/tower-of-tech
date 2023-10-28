import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";
import { BeatSaverMapResponseSuccessSchema, makeBeatSaverMapId } from "@/types/beatsaver.ts";
import { TableDefinition } from "https://deno.land/x/pentagon@v0.1.4/mod.ts";

export const BeatSaverResponseWrapperSchema = z.object({
  id: z.string().transform(makeBeatSaverMapId),
  createdAt: z.date(),
  available: z.boolean(),
  removed: z.boolean(),
});

export const BeatSaverResponseWrapper: TableDefinition = {
  schema: BeatSaverResponseWrapperSchema,
  relations: {
    child: [
      "BeatSaverMapResponseSuccess",
      BeatSaverMapResponseSuccessSchema,
      "id",
      "id",
    ],
  },
};

export const BeatSaverMapResponseSuccess: TableDefinition = {
  schema: BeatSaverMapResponseSuccessSchema,
  relations: {
    parent: ["BeatSaverMap", BeatSaverResponseWrapperSchema, "id", "id"],
  },
};
