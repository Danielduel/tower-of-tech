import { z } from "zod";
import { resource } from "zod-api";
import { broadcasterIdSchema, gameIdSchema } from "@/packages/api-twitch/helix/brand.ts";
import {
  appAuthHeadersSchema,
  paginatedResponseSchemaWrapper,
  userAuthHeadersSchema,
} from "@/packages/api-twitch/helix/common.ts";

export const getHelixChannelsItemSchema = z.object({
  broadcaster_language: z.string(),
  broadcaster_name: z.string(),
  broadcaster_login: z.string(),
  broadcaster_id: broadcasterIdSchema, // numberlike string, transform into branded number id
  game_id: gameIdSchema, // numberlike
  game_name: z.string(),
  title: z.string(),
  delay: z.number(),
  tags: z.array(z.string()),
  content_classification_labels: z.array(z.string()),
  is_branded_content: z.boolean(),
});

export const getHelixChannelsQuerySchema = z.object({
  broadcaster_id: z.string(),
});
export const getHelixChannelsSuccessSchema = paginatedResponseSchemaWrapper(z.array(getHelixChannelsItemSchema));
export const getHelixChannelsHeadersSchema = appAuthHeadersSchema;

export const patchHelixChannelsBodySchema = z.object({
  game_id: gameIdSchema.optional(),
  broadcaster_language: z.string().optional(),
  title: z.string().optional(),
  delay: z.number().optional(),
  tags: z.array(z.string()).optional(),
  // TODO(@Danielduel): content classification labels
  // content_classification_labels: z.array(z.string()).optional(),
  // id: z.string().optional(), // ids of classification labels
  // is_enabled: z.boolean().optional()
  is_branded_content: z.boolean().optional(),
});
export type PatchHelixChannelsBodySchemaT = typeof patchHelixChannelsBodySchema._type;

export const patchHelixChannelsQuerySchema = z.object({
  broadcaster_id: z.string(),
});
export const patchHelixChannelsHeadersSchema = userAuthHeadersSchema;

export const helixChannelsResource = resource("/helix/channels", {
  actions: {
    get: {
      searchParamsSchema: getHelixChannelsQuerySchema,
      headersSchema: getHelixChannelsHeadersSchema,
      dataSchema: getHelixChannelsSuccessSchema,
    },
    patch: {
      searchParamsSchema: patchHelixChannelsQuerySchema,
      headersSchema: patchHelixChannelsHeadersSchema,
      bodySchema: patchHelixChannelsBodySchema,
    },
  },
});
