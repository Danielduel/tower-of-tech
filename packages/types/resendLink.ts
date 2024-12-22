import { z } from "zod";
import { broadcasterIdSchema } from "@/packages/api-twitch/helix/brand.ts";
import { beatSaverMapIdSchema } from "@/packages/types/beatsaver.ts";
import { ToTAccountIdSchema } from "@/packages/types/auth.ts";

export const ResendLinkTwitchBeatSaverResolvableIdKindSchema = z.object({
  id: z.string(),

  targetId: broadcasterIdSchema,
  targetLogin: z.string(),

  sourceId: broadcasterIdSchema,
  sourceLogin: z.string(),

  status: z.enum(["not delivered", "delivered"]),

  deliveredAt: z.date().nullable().default(null),

  comment: z.string().nullable().default(null),
  data: beatSaverMapIdSchema,
});
export type ResendLinkTwitchBeatSaverResolvableIdKindSchemaT =
  typeof ResendLinkTwitchBeatSaverResolvableIdKindSchema._type;

export const ResendLinkTwitchChannelSettingsFlatSchema = z.object({
  twitchId: broadcasterIdSchema,
  twitchLogin: z.string(),
  twitchName: z.string(),

  parentId: ToTAccountIdSchema.nullable().default(null),

  enabled: z.boolean().default(true),
  linkEnabled: z.boolean().default(true),
  resendEnabled: z.boolean().default(true),

  linkCommand: z.string().default("!link"),
  resendCommand: z.string().default("!!"),
  resendRequestCommand: z.string().default("!bsr "),
});
export type ResendLinkTwitchChannelSettingsFlatSchemaT = typeof ResendLinkTwitchChannelSettingsFlatSchema._type;
