import { z } from "zod";
import { TableDefinition } from "pentagon";
import { BeatSaverMapResponseSuccessSchema, makeBeatSaverMapId } from "@/packages/types/beatsaver.ts";

export const BeatSaverResponseWrapperSchema = z.object({
  id: z.string().transform(makeBeatSaverMapId),
  createdAt: z.date(),
  available: z.boolean(),
  removed: z.boolean(),
});

export const BeatSaverResponseWrapper = {
  schema: BeatSaverResponseWrapperSchema,
  relations: {
    child: [
      "BeatSaverMapResponseSuccess",
      BeatSaverMapResponseSuccessSchema,
      "id",
      "id",
    ],
  },
} satisfies TableDefinition<typeof BeatSaverResponseWrapperSchema.shape>;

export const BeatSaverMapResponseSuccess = {
  schema: BeatSaverMapResponseSuccessSchema,
  relations: {
    parent: ["BeatSaverMap", BeatSaverResponseWrapperSchema, "id", "id"],
  },
} satisfies TableDefinition<typeof BeatSaverMapResponseSuccessSchema.shape>;
