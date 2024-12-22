import { z } from "zod";
import { Brand, make } from "@/packages/deps/brand.ts";
import {
  beatLeaderUserAccessTokenSchema,
  beatLeaderUserIdSchema,
  beatLeaderUserRefreshTokenSchema,
} from "@/packages/api-beatleader/brand.ts";
import {
  discordUserAccessTokenSchema,
  discordUserIdSchema,
  discordUserRefreshTokenSchema,
} from "@/packages/api-discord/brand.ts";
import { broadcasterIdSchema } from "@/packages/api-twitch/helix/brand.ts";
import { userAccessTokenSchema } from "@/packages/api-twitch/helix/brand.ts";
import { userRefreshTokenSchema } from "@/packages/api-twitch/helix/brand.ts";

export type ToTAccountId = Brand<string, "ToTAccountId">;
export const makeToTAccountId = make<ToTAccountId>();
export const ToTAccountIdSchema = z.string().transform(makeToTAccountId);

export type ToTAccountSessionId = Brand<string, "ToTAccountSessionId">;
export const makeToTAccountSessionId = make<ToTAccountSessionId>();
export const ToTAccountSessionIdSchema = z.string().transform(makeToTAccountSessionId);

export const DiscordIntegrationSchema = z.object({
  id: discordUserIdSchema,
  parentId: ToTAccountIdSchema,

  username: z.string(),
  global_name: z.string(),
  avatar: z.string(),
});
export type DiscordIntegrationSchemaT = typeof DiscordIntegrationSchema._type;
export const DiscordAuthorizationSchema = z.object({
  id: discordUserIdSchema,
  parentId: ToTAccountIdSchema,

  accessToken: discordUserAccessTokenSchema,
  refreshToken: discordUserRefreshTokenSchema,
  expires: z.date(),
});
export type DiscordAuthorizationSchemaT = typeof DiscordAuthorizationSchema._type;

export const BeatLeaderIntegrationSchema = z.object({
  id: beatLeaderUserIdSchema,
  parentId: ToTAccountIdSchema,

  name: z.string(),
});
export type BeatLeaderIntegrationSchemaT = typeof BeatLeaderIntegrationSchema._type;
export const BeatLeaderAuthorizationSchema = z.object({
  id: beatLeaderUserIdSchema,
  parentId: ToTAccountIdSchema,

  accessToken: beatLeaderUserAccessTokenSchema,
  refreshToken: beatLeaderUserRefreshTokenSchema,
  expires: z.date(),
});
export type BeatLeaderAuthorizationSchemaT = typeof BeatLeaderAuthorizationSchema._type;

export const TwitchIntegrationSchema = z.object({
  id: broadcasterIdSchema,
  parentId: ToTAccountIdSchema,

  login: z.string(),
  displayName: z.string().nullable().default(null),
});
export type TwitchIntegrationSchemaT = typeof TwitchIntegrationSchema._type;
export const TwitchAuthorizationSchema = z.object({
  id: broadcasterIdSchema,
  parentId: ToTAccountIdSchema,

  accessToken: userAccessTokenSchema,
  refreshToken: userRefreshTokenSchema,
  expires: z.date(),
});
export type TwitchAuthorizationSchemaT = typeof TwitchAuthorizationSchema._type;

export const ToTAccountSessionSchema = z.object({
  id: ToTAccountSessionIdSchema,

  lastActiveAt: z.date(),

  parentId: ToTAccountIdSchema,
});
export type ToTAccountSessionSchemaT = typeof ToTAccountSessionSchema._type;

export const ToTAccountSchema = z.object({
  id: ToTAccountIdSchema,
  version: z.number().default(0),

  sessions: z.array(ToTAccountSessionSchema),
  sessionIds: z.array(ToTAccountSessionIdSchema),

  beatLeaderId: beatLeaderUserIdSchema.nullable().default(null),
  beatLeader: BeatLeaderIntegrationSchema.nullable().default(null),

  discordId: discordUserIdSchema.nullable().default(null),
  discord: DiscordIntegrationSchema.nullable().default(null),

  twitchId: broadcasterIdSchema.nullable().default(null),
  twitch: TwitchIntegrationSchema.nullable().default(null),
});
export type ToTAccountSchemaT = typeof ToTAccountSchema._type;

export const ToTAccountFlatSchema = z.object({
  id: ToTAccountIdSchema,
  version: z.number().default(0),
  sessionIds: z.array(ToTAccountSessionIdSchema),

  beatLeaderId: beatLeaderUserIdSchema.nullable().default(null),
  discordId: discordUserIdSchema.nullable().default(null),
  twitchId: broadcasterIdSchema.nullable().default(null),
});
export type ToTAccountFlatSchemaT = typeof ToTAccountFlatSchema._type;
