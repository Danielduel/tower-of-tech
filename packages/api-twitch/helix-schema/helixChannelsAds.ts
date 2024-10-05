import { z } from "zod";
import { resource } from "zod-api";
import { userAuthHeadersSchema, zodParseIntSchema } from "@/packages/api-twitch/helix-schema/common.ts";

export const helixChannelsAdsItemSchema = z.object({
  next_ad_at: z.string().datetime(),
  last_ad_at: z.string().datetime(),
  duration: zodParseIntSchema,
  preroll_free_time: zodParseIntSchema,
  snooze_count: zodParseIntSchema,
  snooze_refresh_at: z.string().datetime(),
});

export const helixChannelsAdsQuerySchema = z.object({
  broadcaster_id: z.string(),
});
export const helixChannelsAdsSuccessSchema = z.array(helixChannelsAdsItemSchema);
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
