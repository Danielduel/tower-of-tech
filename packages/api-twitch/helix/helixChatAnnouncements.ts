import { resource } from "zod-api";
import { z } from "zod";
import { userAuthHeadersSchema } from "@/packages/api-twitch/helix/common.ts";
import { broadcasterIdSchema } from "@/packages/api-twitch/helix/brand.ts";

export const helixChatAnnouncementsBodySchema = z.object({
  message: z.string(),
  color: z.enum(["blue", "green", "orange", "purple", "primary"]).default("primary").optional(),
});
export type HelixChatAnnouncementsBodySchemaT = typeof helixChatAnnouncementsBodySchema._type;

export const helixChatAnnouncementsQuerySchema = z.object({
  broadcaster_id: broadcasterIdSchema,
  moderator_id: broadcasterIdSchema,
});

export const helixChatAnnouncementsHeadersSchema = userAuthHeadersSchema;

export const helixChatAnnouncementsResource = resource("/helix/chat/announcements", {
  actions: {
    post: {
      searchParamsSchema: helixChatAnnouncementsQuerySchema,
      headersSchema: helixChatAnnouncementsHeadersSchema,
      bodySchema: helixChatAnnouncementsBodySchema,
    },
  },
});
