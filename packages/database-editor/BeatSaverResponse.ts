import { z } from "zod";
import { collection } from "kvdex/mod.ts";
import { zodModel } from "kvdex/ext/zod.ts";
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
    idGenerator: (item) => item.id,
    history: true,
    indices: {
      hash: "primary",
    },
  },
);

export const BeatSaverResponseWrapper = collection(
  zodModel(BeatSaverResponseWrapperSchema),
  {
    idGenerator: (item) => item.id,
    history: true,
  },
);

export const BeatSaverMapResponseSuccess = collection(
  zodModel(BeatSaverMapResponseSuccessSchema),
  {
    idGenerator: (item) => item.id,
    history: true,
  },
);
