import { resource } from "zod-api";
import { z } from "zod";
import { userAuthHeadersSchema } from "@/packages/api-twitch/helix/common.ts";
import { broadcasterIdSchema } from "@/packages/api-twitch/helix/brand.ts";

// channel.channel_points_custom_reward_redemption.add

export const helixEventSubSubscriptionsQuerySchema = z.object({
  type: z.string(), // z.enum(["channel.follow", "channel.channel_points_custom_reward_redemption.add"]),
  version: z.enum(["1", "2"]),
  condition: z.object({
    to_broadcaster_user_id: broadcasterIdSchema.optional(),
    broadcaster_user_id: broadcasterIdSchema.optional(),
    moderator_user_id: broadcasterIdSchema.optional() 
  }),
  transport: z.object({
    method: z.enum(["websocket"]),
    session_id: z.string(),
  })
});
export type HelixEventSubSubscriptionsQuerySchemaT = typeof helixEventSubSubscriptionsQuerySchema._type;

export const helixEventSubSubscriptionsHeadersSchema = userAuthHeadersSchema;

export const helixEventSubSubscriptionsResource = resource("/helix/eventsub/subscriptions", {
  actions: {
    post: {
      dataSchema: z.any(),
      bodySchema: helixEventSubSubscriptionsQuerySchema,
      headersSchema: helixEventSubSubscriptionsHeadersSchema,
    },
  },
});
