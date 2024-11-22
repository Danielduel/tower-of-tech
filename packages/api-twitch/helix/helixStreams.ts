import { z } from "zod";
import { broadcasterIdSchema, gameIdSchema } from "@/packages/api-twitch/helix/brand.ts";
import { appAuthHeadersSchema, paginatedResponseSchemaWrapper } from "@/packages/api-twitch/helix/common.ts";
import { resource } from "zod-api";

export const helixStreamsItemSchema = z.object({
  id: z.string(), // numberlike string
  user_id: broadcasterIdSchema, // numberlike string, transform into branded number id
  user_login: z.string(),
  user_name: z.string(),

  game_id: gameIdSchema, // numberlike
  game_name: z.string(),
  type: z.string(), // "live"
  title: z.string(),
  viewer_count: z.number(),
  started_at: z.string(), // datelike
  language: z.string(), // "en"
  thumbnail_url: z.string(), // avatar URL
  tag_ids: z.array(z.any()),
  tags: z.array(z.string()),
  is_mature: z.boolean(),
});

export const helixStreamsQuerySchema = z.object({
  // user_id: z.string().optional(),
  user_login: z.string().optional(),
  game_id: z.string().optional(),
  first: z.number().default(20),
  // todo add the rest
});
export const helixStreamsSuccessSchema = paginatedResponseSchemaWrapper(z.array(helixStreamsItemSchema));
export const helixStreamsHeadersSchema = appAuthHeadersSchema;

export const helixStreamsResource = resource("/helix/streams", {
  actions: {
    get: {
      searchParamsSchema: helixStreamsQuerySchema,
      headersSchema: helixStreamsHeadersSchema,
      dataSchema: helixStreamsSuccessSchema,
    },
  },
});
