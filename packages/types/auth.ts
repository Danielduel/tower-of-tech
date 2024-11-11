import { z } from "zod";
import { Brand, make } from "@/packages/deps/brand.ts";
import {
  beatLeaderUserAccessTokenSchema,
  beatLeaderUserIdSchema,
  beatLeaderUserRefreshTokenSchema,
} from "@/packages/api-beatleader/brand.ts";

export type ToTAccountId = Brand<string, "ToTAccountId">;
export const makeToTAccountId = make<ToTAccountId>();

export type ToTSessionId = Brand<string, "ToTSessionId">;
export const makeToTSessionId = make<ToTSessionId>();

export const BeatLeaderIntegrationSchema = z.object({
  id: beatLeaderUserIdSchema,
  parentId: z.string().transform(makeToTAccountId),

  name: z.string(),

  accessToken: beatLeaderUserAccessTokenSchema,
  refreshToken: beatLeaderUserRefreshTokenSchema,
  expires: z.date(),
});
export type BeatLeaderIntegrationSchemaT = typeof BeatLeaderIntegrationSchema._type;

export const BeatLeaderIntegrationSafeSchema = z.object({
  id: beatLeaderUserIdSchema,
  parentId: z.string().transform(makeToTAccountId),

  name: z.string(),

  accessToken: z.never(),
  refreshToken: z.never(),
  expires: z.never(),
});
export type BeatLeaderIntegrationSafeSchemaT = typeof BeatLeaderIntegrationSafeSchema._type;

export const ToTAccountSessionSchema = z.object({
  id: z.string().transform(makeToTSessionId),

  lastActiveAt: z.date(),

  parentId: z.string().transform(makeToTAccountId),
});
export type ToTAccountSessionSchemaT = typeof ToTAccountSessionSchema._type;

export const ToTAccountSchema = z.object({
  id: z.string().transform(makeToTAccountId),
  version: z.number().default(0),

  sessions: z.array(ToTAccountSessionSchema),
  sessionIds: z.array(z.string().transform(makeToTSessionId)),

  beatLeaderId: beatLeaderUserIdSchema.nullable(),
  beatLeader: BeatLeaderIntegrationSchema.nullable(),
});
export type ToTAccountSchemaT = typeof ToTAccountSchema._type;

export const ToTAccountSafeSchema = z.object({
  id: z.string().transform(makeToTAccountId),
  version: z.number().default(0),

  sessions: z.array(ToTAccountSessionSchema),
  sessionIds: z.array(z.string().transform(makeToTSessionId)),

  beatLeaderId: beatLeaderUserIdSchema.nullable(),
  beatLeader: BeatLeaderIntegrationSafeSchema.nullable(),
});
export type ToTAccountSafeSchemaT = typeof ToTAccountSafeSchema._type;

export const ToTAccountFlatSchema = z.object({
  id: z.string().transform(makeToTAccountId),
  version: z.number().default(0),
  sessionIds: z.array(z.string().transform(makeToTSessionId)),

  beatLeaderId: beatLeaderUserIdSchema.nullable(),
});
export type ToTAccountFlatSchemaT = typeof ToTAccountFlatSchema._type;
