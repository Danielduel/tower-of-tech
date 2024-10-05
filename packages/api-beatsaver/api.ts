import { z } from "zod";
import { client, resource } from "zod-api";
import { BeatSaverMapByIdResponseSchema, BeatSaverMapResponseSuccessSchema } from "@/packages/types/beatsaver.ts";
import { fetcher } from "@/packages/api-utils/fetcher.ts";
import { getLogger } from "@/packages/api-utils/logger.ts";

export const BeatSaverApi = client({
  fetcher,
  baseUrl: "https://api.beatsaver.com/",
  logger: await getLogger(),
  resources: {
    mapById: resource("/maps/id/:id", {
      urlParamsSchema: z.object({
        id: z.string(),
      }),
      actions: {
        get: {
          dataSchema: BeatSaverMapResponseSuccessSchema,
        },
      },
    }),

    // up to 50 ids
    mapsByIds: resource("/maps/ids/:ids", {
      urlParamsSchema: z.object({
        ids: z.string(),
      }),
      actions: {
        get: {
          dataSchema: BeatSaverMapByIdResponseSchema,
        },
      },
    }),

    // up to 50 hashes
    mapByHash: resource("/maps/hash/:hash", {
      urlParamsSchema: z.object({
        hash: z.string().regex(/[0-9a-f,]+/),
      }),
      actions: {
        get: {
          dataSchema: BeatSaverMapResponseSuccessSchema,
        },
      },
    }),
  },
});
