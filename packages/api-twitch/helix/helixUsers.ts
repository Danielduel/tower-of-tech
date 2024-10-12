import { z } from "zod";
import { resource } from "zod-api";
import { broadcasterIdSchema } from "@/packages/api-twitch/helix/brand.ts";
import { responseSchemaWrapper, userAuthHeadersSchema } from "@/packages/api-twitch/helix/common.ts";
import { zodParseStringAsDateSchema } from "@/packages/utils/zod.ts";

export const getHelixUsersItemSchema = z.object({
  id: broadcasterIdSchema,
  login: z.string(),
  display_name: z.string(),
  type: z.enum(["admin", "global_mod", "staff", ""]),
  broadcaster_type: z.enum(["affiliate", "partner", ""]),
  description: z.string(),
  profile_image_url: z.string(),
  offline_image_url: z.string(),
  // view_count: z.number(), // deprecated https://dev.twitch.tv/docs/api/reference/#get-users
  email: z.string().optional(), // optional?
  created_at: zodParseStringAsDateSchema,
});
export type GetHelixUsersItemSchemaT = typeof getHelixUsersItemSchema._type;

// export const getHelixUsersQuerySchema = z.object({
//   id: z.string(),
//   login: z.string(),
// });
export const getHelixUsersSuccessSchema = responseSchemaWrapper(z.array(getHelixUsersItemSchema));
export const getHelixUsersHeadersSchema = userAuthHeadersSchema;

export const helixUsersResource = resource("/helix/users", {
  actions: {
    get: {
      // searchParamsSchema: getHelixUsersQuerySchema,
      headersSchema: getHelixUsersHeadersSchema,
      dataSchema: getHelixUsersSuccessSchema,
    },
  },
});
