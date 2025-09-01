import { collection } from "@/packages/deps/kvdex.ts";
import {
  BeatSaverIdToHashCacheSchema,
  BeatSaverMapResponseSuccessSchema,
  BeatSaverResponseWrapperSchema,
} from "@/packages/types/beatsaver.ts";

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
