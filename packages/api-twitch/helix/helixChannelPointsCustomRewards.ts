import { z } from "zod";
import { resource } from "zod-api";
import { userAuthHeadersSchema } from "@/packages/api-twitch/helix/common.ts";
import { broadcasterIdSchema, twitchChannelPointsCustomRewardIdSchema } from "@/packages/api-twitch/helix/brand.ts";

export const postHelixChannelPointsCustomRewardsItemSchema = z.object({
  id: twitchChannelPointsCustomRewardIdSchema,
  broadcaster_id: broadcasterIdSchema,
  broadcaster_login: z.string(),
  broadcaster_name: z.string(),
  title: z.string(),
  prompt: z.string().optional(),
  cost: z.number(),
  image: z.any(), // TODO(@Danielduel)
  defaultImage: z.any(), // TODO(@Danielduel)
  background_color: z.string(),
  is_enabled: z.boolean(),
  is_user_input_required: z.boolean(),
  max_per_stream_setting: z.any(), // TODO(@Danielduel)
  max_per_user_per_stream_setting: z.any(), // TODO(@Danielduel)
  global_cooldown_setting: z.any(), // TODO(@Danielduel)
  is_paused: z.boolean(),
  is_in_stock: z.boolean(),
  should_redemptions_skip_request_queue: z.boolean(),
  redemptions_redeemed_current_stream: z.number().nullable(),
  cooldown_expires_at: z.string().nullable(),
});
export type PostHelixChannelPointsCustomRewardsItemSchemaT = typeof postHelixChannelPointsCustomRewardsItemSchema._type;
export const postHelixChannelPointsCustomRewardsSuccessSchema = z.object({
  data: z.array(postHelixChannelPointsCustomRewardsItemSchema),
});

export const postHelixChannelPointsCustomRewardsBodySchema = z.object({
  title: z.string(),
  cost: z.number(),
  prompt: z.string().optional(),
  is_enabled: z.boolean().default(true).optional(),
  background_color: z.string().optional(),
  is_user_input_required: z.boolean().default(false).optional(),
  is_max_per_stream_enabled: z.boolean().default(false).optional(),
  max_per_stream: z.number().default(1).optional(),
  is_max_per_user_per_stream_enabled: z.boolean().default(false).optional(),
  max_per_user_per_stream: z.number().default(1).optional(),
  is_global_cooldown_enabled: z.boolean().default(false).optional(),
  global_cooldown_seconds: z.number().default(1).optional(),
  should_redemptions_skip_request_queue: z.boolean().default(false).optional(),
});
export type PostHelixChannelPointsCustomRewardsBodySchemaT = typeof postHelixChannelPointsCustomRewardsBodySchema._type;

export const postHelixChannelPointsCustomRewardsQuerySchema = z.object({
  broadcaster_id: broadcasterIdSchema,
});
export const postHelixChannelPointsCustomRewardsHeadersSchema = userAuthHeadersSchema;

export const getHelixChannelPointsCustomRewardsItemSchema = postHelixChannelPointsCustomRewardsItemSchema;
export type GetHelixChannelPointsCustomRewardsItemSchemaT = typeof getHelixChannelPointsCustomRewardsItemSchema._type;
export const getHelixChannelPointsCustomRewardsQuerySchema = z.object({
  broadcaster_id: broadcasterIdSchema,
  id: twitchChannelPointsCustomRewardIdSchema.optional(),
  only_manageable_rewards: z.boolean().optional(),
});

export const getHelixChannelPointsCustomRewardsSuccessSchema = z.object({
  data: z.array(getHelixChannelPointsCustomRewardsItemSchema),
});
export const getHelixChannelPointsCustomRewardsHeadersSchema = userAuthHeadersSchema;

export const patchHelixChannelPointsCustomRewardsQuerySchema = z.object({
  broadcaster_id: broadcasterIdSchema,
  id: twitchChannelPointsCustomRewardIdSchema,
});
export const patchHelixChannelPointsCustomRewardsHeadersSchema = userAuthHeadersSchema;
export const patchHelixChannelPointsCustomRewardsBodySchema = z.object({
  title: z.string().optional(),
  cost: z.number().optional(),
  prompt: z.string().optional(),
  is_enabled: z.boolean().optional(),
  background_color: z.string().optional(),
  is_user_input_required: z.boolean().optional(),
  is_max_per_stream_enabled: z.boolean().optional(),
  max_per_stream: z.number().optional(),
  is_max_per_user_per_stream_enabled: z.boolean().optional(),
  max_per_user_per_stream: z.number().optional(),
  is_global_cooldown_enabled: z.boolean().optional(),
  is_paused: z.boolean().optional(),
  global_cooldown_seconds: z.number().optional(),
  should_redemptions_skip_request_queue: z.boolean().optional(),
});
export type PatchHelixChannelPointsCustomRewardsBodySchemaT =
  typeof patchHelixChannelPointsCustomRewardsBodySchema._type;
export const patchHelixChannelPointsCustomRewardsSuccessSchema = postHelixChannelPointsCustomRewardsSuccessSchema;

export const helixChannelPointsCustomRewardsResource = resource("/helix/channel_points/custom_rewards", {
  actions: {
    post: {
      searchParamsSchema: postHelixChannelPointsCustomRewardsQuerySchema,
      headersSchema: postHelixChannelPointsCustomRewardsHeadersSchema,
      dataSchema: postHelixChannelPointsCustomRewardsSuccessSchema,
      bodySchema: postHelixChannelPointsCustomRewardsBodySchema,
    },
    get: {
      dataSchema: getHelixChannelPointsCustomRewardsSuccessSchema,
      searchParamsSchema: getHelixChannelPointsCustomRewardsQuerySchema,
      headersSchema: getHelixChannelPointsCustomRewardsHeadersSchema,
    },
    patch: {
      headersSchema: patchHelixChannelPointsCustomRewardsHeadersSchema,
      searchParamsSchema: patchHelixChannelPointsCustomRewardsQuerySchema,
      bodySchema: patchHelixChannelPointsCustomRewardsBodySchema,
      dataSchema: patchHelixChannelPointsCustomRewardsSuccessSchema,
    },
  },
});
