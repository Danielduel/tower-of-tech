import { resource } from "zod-api";
import { z } from "zod";
import { userAuthHeadersSchema } from "@/packages/api-twitch/helix/common.ts";
import { broadcasterIdSchema } from "@/packages/api-twitch/helix/brand.ts";

export const helixChatShoutoutQuerySchema = z.object({
  from_broadcaster_id: broadcasterIdSchema,
  to_broadcaster_id: broadcasterIdSchema,
  moderator_id: broadcasterIdSchema,
});

export const helixChatShoutoutHeadersSchema = userAuthHeadersSchema;

export const helixChatShoutoutResource = resource("/helix/chat/shoutouts", {
  actions: {
    post: {
      searchParamsSchema: helixChatShoutoutQuerySchema,
      headersSchema: helixChatShoutoutHeadersSchema,
    },
  },
});
