import { z } from "zod";
import { resource } from "zod-api";
import { userAuthHeadersSchema } from "@/packages/api-twitch/helix/common.ts";
import { zodParseNumberAsRFC3339DateSchema } from "@/packages/utils/zod.ts";

export const helixChannelsAdsScheduleSnoozeItemSchema = z.object({
  next_ad_at: zodParseNumberAsRFC3339DateSchema,
  snooze_count: z.number(),
  snooze_refresh_at: zodParseNumberAsRFC3339DateSchema,
});
export type HelixChannelsAdsScheduleSnoozeItemSchemaT = typeof helixChannelsAdsScheduleSnoozeItemSchema._type;

export const helixChannelsAdsScheduleSnoozeQuerySchema = z.object({
  broadcaster_id: z.string(),
});
export const helixChannelsAdsScheduleSnoozeSuccessSchema = z.object({
  data: z.array(helixChannelsAdsScheduleSnoozeItemSchema),
});

export const helixChannelsAdsScheduleSnoozeHeadersSchema = userAuthHeadersSchema;

export const helixChannelsAdsScheduleSnoozeResource = resource("/helix/channels/ads/schedule/snooze", {
  actions: {
    post: {
      searchParamsSchema: helixChannelsAdsScheduleSnoozeQuerySchema,
      headersSchema: helixChannelsAdsScheduleSnoozeHeadersSchema,
      dataSchema: helixChannelsAdsScheduleSnoozeSuccessSchema,
    },
  },
});
