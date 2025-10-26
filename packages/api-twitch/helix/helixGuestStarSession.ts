import { resource } from "zod-api";
import { z } from "zod";
import { userAuthHeadersSchema } from "@/packages/api-twitch/helix/common.ts";
import { broadcasterIdSchema } from "@/packages/api-twitch/helix/brand.ts";

export const helixGuestStarSessionGetQuerySchema = z.object({
  broadcaster_id: broadcasterIdSchema,
});
const helixGuestStarSessionGetBodySessionSchema = z.object({
  id: z.string(),
  // ... more
}) 
export const helixGuestStarSessionGetBodySchema = z.object({
  data: z.array(helixGuestStarSessionGetBodySessionSchema),
});
export type HelixGuestStarSessionGetQuerySchemaT = typeof helixGuestStarSessionGetQuerySchema._type;
export const helixGuestStarSessionGetHeadersSchema = userAuthHeadersSchema;

export const helixGuestStarSessionResource = resource("/helix/guest_star/session", {
  actions: {
    post: {
      searchParamsSchema: helixGuestStarSessionGetQuerySchema,
      dataSchema: z.any(),
      bodySchema: helixGuestStarSessionGetBodySchema,
      headersSchema: helixGuestStarSessionGetHeadersSchema,
    },
  },
});
