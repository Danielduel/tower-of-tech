import { z } from "zod";
import { broadcasterIdSchema, gameIdSchema } from "@/packages/api-twitch/helix/brand.ts";
import { appAuthHeadersSchema, paginatedResponseSchemaWrapper } from "@/packages/api-twitch/helix/common.ts";
import { resource } from "zod-api";

export const helixSearchChannelsItemSchema = z.object({
  broadcaster_language: z.string(),
  broadcaster_login: z.string(),
  display_name: z.string(),
  game_id: gameIdSchema, // numberlike
  game_name: z.string(),
  id: broadcasterIdSchema, // numberlike string, transform into branded number id
  is_live: z.boolean(),
  tag_ids: z.array(z.any()),
  tags: z.array(z.string()),
  thumbnail_url: z.string(), // avatar URL
  title: z.string(),
  started_at: z.string(), // datelike
});

export const helixSearchChannelsQuerySchema = z.object({
  query: z.string(),
  first: z.number().default(20),
  // todo add the rest
});
export const helixSearchChannelsSuccessSchema = paginatedResponseSchemaWrapper(z.array(helixSearchChannelsItemSchema));
export const helixSearchChannelsHeadersSchema = appAuthHeadersSchema;

export const helixSearchChannelsResource = resource("/helix/search/channels", {
  actions: {
    get: {
      searchParamsSchema: helixSearchChannelsQuerySchema,
      headersSchema: helixSearchChannelsHeadersSchema,
      dataSchema: helixSearchChannelsSuccessSchema,
    },
  },
});
