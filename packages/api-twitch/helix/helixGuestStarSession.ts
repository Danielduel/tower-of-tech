import { resource } from "zod-api";
import { z } from "zod";
import { userAuthHeadersSchema } from "@/packages/api-twitch/helix/common.ts";
import { broadcasterIdSchema } from "@/packages/api-twitch/helix/brand.ts";

export const helixGuestStarSessionGetQuerySchema = z.object({


});
export type HelixGuestStarSessionGetQuerySchemaT = typeof helixGuestStarSessionGetQuerySchema._type;

export const helixGuestStarSessionGetHeadersSchema = userAuthHeadersSchema;

export const helixGuestStarSessionResource = resource("/helix/guest_star/session", {
  actions: {
    post: {
      dataSchema: z.any(),
      bodySchema: helixGuestStarSessionGetQuerySchema,
      headersSchema: helixGuestStarSessionGetHeadersSchema,
    },
  },
});
