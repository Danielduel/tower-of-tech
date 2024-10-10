import { broadcasterIdSchema } from "@/packages/api-twitch/helix-schema/brand.ts";
import { z } from "zod";
import { zodParseStringAsDateSchema } from "@/packages/utils/zod.ts";

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
