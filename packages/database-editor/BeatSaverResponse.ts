import { collection } from "@/packages/deps/kvdex.ts";
import { z } from "zod";
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
  BeatSaverIdToHashCacheSchema,
  {
    idGenerator: (item) => item.id,
    history: true,
    indices: {
      hash: "primary",
    },
  },
);

export const BeatSaverResponseWrapper = collection(
  BeatSaverResponseWrapperSchema,
  {
    idGenerator: (item) => item.id,
    history: true,
  },
);

export const BeatSaverMapResponseSuccess = collection(
  BeatSaverMapResponseSuccessSchema,
  {
    idGenerator: (item) => item.id,
    history: true,
  },
);
