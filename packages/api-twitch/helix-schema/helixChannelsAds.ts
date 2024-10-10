import { z } from "zod";
import { resource } from "zod-api";
import { userAuthHeadersSchema } from "@/packages/api-twitch/helix-schema/common.ts";
import { zodParseNumberAsRFC3339DateSchema } from "@/packages/utils/zod.ts";

export const helixChannelsAdsItemSchema = z.object({
  next_ad_at: zodParseNumberAsRFC3339DateSchema,
  last_ad_at: zodParseNumberAsRFC3339DateSchema,
  duration: z.number(),
  preroll_free_time: z.number(),
  snooze_count: z.number(),
  snooze_refresh_at: zodParseNumberAsRFC3339DateSchema,
});

export const helixChannelsAdsQuerySchema = z.object({
  broadcaster_id: z.string(),
});
export const helixChannelsAdsSuccessSchema = z.object({
  data: z.array(helixChannelsAdsItemSchema),
});

export const helixChannelsAdsHeadersSchema = userAuthHeadersSchema;

export const helixChannelsAdsResource = resource("/helix/channels/ads", {
  actions: {
    get: {
      searchParamsSchema: helixChannelsAdsQuerySchema,
      headersSchema: helixChannelsAdsHeadersSchema,
      dataSchema: helixChannelsAdsSuccessSchema,
    },
  },
});
