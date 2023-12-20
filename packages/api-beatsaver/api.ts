import { z } from "zod";
import {
  zodApiClient,
  zodApiResource,
} from "https://deno.land/x/zod_api@v0.3.1/mod.ts";
import {
  BeatSaverMapByHashResponseSchema,
  BeatSaverMapByIdResponseSchema,
  BeatSaverMapResponseSuccessSchema,
} from "../types/beatsaver.ts";
import { fetcher } from "../fetcher/mod.ts";
import { getLogger } from "../logger/mod.ts";

export const BeatSaverApi = zodApiClient({
  fetcher,
  baseUrl: "https://api.beatsaver.com/",
  logger: await getLogger(),
  resources: {
    mapById: zodApiResource("/maps/id/:id", {
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
    mapsByIds: zodApiResource("/maps/ids/:ids", {
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
    mapByHash: zodApiResource("/maps/hash/:hash", {
      urlParamsSchema: z.object({
        hash: z.string().regex(/[0-9a-f,]+/),
      }),
      actions: {
        get: {
          dataSchema: BeatSaverMapByHashResponseSchema,
        },
      },
    }),
  },
});
