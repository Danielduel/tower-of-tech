import { z } from "zod";
import { client, resource } from "zod-api";
import { fetcher } from "@/packages/api-utils/fetcher.ts";
import { getLogger } from "@/packages/api-utils/logger.ts";
import { discordUserAuthHeadersSchema } from "@/packages/api-discord/common.ts";
import { discordUserIdSchema } from "@/packages/api-discord/brand.ts";

const discordApiUsersMeBodySchema = z.object({
  id: discordUserIdSchema,
  username: z.string(),
  avatar: z.string(),
  discriminator: z.string(),
  public_flags: z.number(),
  flags: z.number(),
  banner: z.string().nullable(),
  accent_color: z.string().nullable(),
  global_name: z.string(),
  avatar_decoration_data: z.any().nullable(), // ?
  banner_color: z.string().nullable(),
  clan: z.string().nullable(),
  mfa_enabled: z.boolean(),
  locale: z.string(),
  premium_type: z.number(),
});
export type DiscordApiUsersMeBodySchemaT = typeof discordApiUsersMeBodySchema._type;

export const DiscordApi = client({
  fetcher,
  baseUrl: "https://discordapp.com",
  logger: await getLogger(),
  resources: {
    usersMe: resource("/api/users/@me", {
      actions: {
        get: {
          headersSchema: discordUserAuthHeadersSchema,
          dataSchema: discordApiUsersMeBodySchema,
        },
      },
    }),
  },
});
