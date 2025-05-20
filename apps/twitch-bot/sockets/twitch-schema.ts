import { broadcasterIdSchema } from "@/packages/api-twitch/helix/brand.ts";
import { z } from "zod";
import { zodParseStringAsDateSchema } from "@/packages/utils/zod.ts";
import { tryParse } from "@/packages/utils/tryParse.ts";

export const TwitchRedemptionRewardSchema = z.object({
  id: z.string(),
  channel_id: broadcasterIdSchema,
  title: z.string(),
  prompt: z.string(),
  cost: z.number(),
  is_user_input_required: z.boolean(),
  is_sub_only: z.boolean(),
  image: z.any(), // ?
  default_image: z.any(), // not sure if it's object in every case
  background_color: z.string(),
  is_enabled: z.boolean(),
  is_paused: z.boolean(),
  is_in_stock: z.boolean(),
  max_per_stream: z.object({
    is_enabled: z.boolean(),
    max_per_stream: z.number(),
  }),
  should_redemptions_skip_request_queue: z.boolean(),
  template_id: z.any(), // ?
  updated_for_indicator_at: zodParseStringAsDateSchema,
  max_per_user_per_stream: z.object({
    is_enabled: z.boolean(),
    max_per_user_per_stream: z.number(),
  }),
  global_cooldown: z.object({
    is_enabled: z.boolean(),
    global_cooldown_seconds: z.number(),
  }),
  redemptions_redeemed_current_stream: z.any(),
  cooldown_expires_at: z.any(),
});
export type TwitchRedemptionRewardSchemaT = typeof TwitchRedemptionRewardSchema._type;

export const TwitchRedemptionSchema = z.object({
  id: z.string(),
  user: z.object({
    id: z.string(),
    login: z.string(),
    display_name: z.string(),
  }),
  channel_id: broadcasterIdSchema,
  redeemed_at: zodParseStringAsDateSchema,
  reward: TwitchRedemptionRewardSchema,
});

export type TwitchRedemptionSchemaT = typeof TwitchRedemptionSchema._type;
export const eventSubWelcomeMetadataSchema = z.object({
  message_id: z.string(),
  message_type: z.enum(["session_welcome"]),
  message_timestamp: z.string(),
});

export const eventSubMetadataKeepaliveSchema = z.object({
  message_id: z.string(),
  message_type: z.enum(["session_keepalive"]),
  message_timestamp: z.string(),
});

export const eventSubMetadataNotificationSchema = z.object({
  message_id: z.string(),
  message_type: z.enum(["notification"]),
  message_timestamp: z.string(),
});

export const eventSubGenericMetadataSchema = z.object({
  message_id: z.string(),
  message_type: z.enum(["session_welcome", "session_keepalive", "notification"]),
  message_timestamp: z.string(),
});

export const eventSubWelcomePayloadSessionPayloadSchema = z.object({
  id: z.string(),
  status: z.enum(["connected"]),
  connected_at: z.string(),
  keepalive_timeout_seconds: z.number(),
  reconnect_url: z.null(),
  recovery_url: z.null(),
});

export const eventSubNotificationPayloadSchema = z.object({
  subscription: z.object({
    id: z.string(),
    status: z.enum(["enabled"]),
    type: z.string(),
    version: z.enum(["1", "2"]),
    condition: z.unknown(),
    transport: z.unknown(),
    created_at: z.string(),
    cost: z.number(),
  }),
  event: z.object({
    broadcaster_user_id: broadcasterIdSchema,
    broadcaster_user_login: z.string(),
    broadcaster_user_name: z.string(),
    id: z.string(),
    user_id: broadcasterIdSchema,
    user_login: z.string(),
    user_name: z.string(),
    user_input: z.string(),
    status: z.enum(["fulfilled", "unfulfilled"]),
    redeemed_at: zodParseStringAsDateSchema,
    reward: z.object({
      id: z.string(),
      title: z.string(),
      prompt: z.string(),
      cost: z.number(),
    })
  })
});

export const eventSubWelcomePayloadSchema = z.object({
  session: eventSubWelcomePayloadSessionPayloadSchema,
});

export const eventSubWelcomeTypeSchema = z.object({
  type: z.enum(["message"]),
  data: z.string().transform(tryParse),
});

export const eventSubWelcomeInnerTypeSchema = z.object({
  metadata: eventSubWelcomeMetadataSchema,
  payload: eventSubWelcomePayloadSchema,
});
export type EventSubWelcomeInnerTypeSchemaT = typeof eventSubWelcomeInnerTypeSchema._type;

export const eventSubTypeSchema = z.object({
  type: z.enum(["message"]),
  data: z.string().transform(tryParse),
});

export const eventSubInnerTypeKeepaliveSchema = z.object({
  metadata: eventSubMetadataKeepaliveSchema,
  payload: z.object({})
});

export const eventSubInnerTypeGenericSchema = z.object({
  metadata: eventSubGenericMetadataSchema,
  payload: z.unknown(),
});

export const eventSubInnerTypeNotificationSchema = z.object({
  metadata: eventSubMetadataNotificationSchema,
  payload: eventSubNotificationPayloadSchema,
});

export const eventSubTopicSchema = z.object({
  topic: z.string(),
  message: z.string().transform(tryParse),
});

export const eventSubMessageSchema = z.object({
  type: z.string(),
  data: z.object({
    timestamp: zodParseStringAsDateSchema,
    status: z.enum(["UNFULFILLED", "FULFILLED"]).optional(),
    redemption: TwitchRedemptionSchema,
  }),
});


