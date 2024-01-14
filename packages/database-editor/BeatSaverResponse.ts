import { z } from "zod";
import { collection } from "kvdex/mod.ts";
import { zodModel } from "kvdex/ext/zod.ts";
import { TableDefinition } from "pentagon";
import {
  BeatSaverIdToHashCacheSchema,
  BeatSaverMapResponseSuccessSchema,
  makeBeatSaverMapId,
} from "@/packages/types/beatsaver.ts";

export const BeatSaverResponseWrapperSchema = z.object({
  id: z.string().transform(makeBeatSaverMapId),
  createdAt: z.date(),
  available: z.boolean(),
  removed: z.boolean(),
});

export const BeatSaverIdToHashCache = collection(
  zodModel(BeatSaverIdToHashCacheSchema),
  {
    history: true,
    indices: {
      id: "primary",
      hash: "secondary",
    },
  },
);

export const BeatSaverResponseWrapper = collection(
  zodModel(BeatSaverResponseWrapperSchema),
  {
    history: true,
    indices: {
      id: "primary",
    },
  },
);

export const BeatSaverMapResponseSuccess = collection(
  zodModel(BeatSaverMapResponseSuccessSchema),
  {
    history: true,
    indices: {
      id: "primary",
    },
  },
);
