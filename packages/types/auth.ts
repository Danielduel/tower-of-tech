import { z } from "zod";
import { Brand, make } from "@/packages/deps/brand.ts";

export type ToTUserId = Brand<string, "ToTUserId">;
export const makeToTUserId = make<ToTUserId>();

export type BeatLeaderUserId = Brand<string, "BeatLeaderUserId">;
export const makeBeatLeaderUserId = make<BeatLeaderUserId>();

export const BeatLeaderIntegrationSchema = z.object({
  id: z.string().transform(makeBeatLeaderUserId),
  parentId: z.string().transform(makeToTUserId),

  token: z.string(),
  refreshToken: z.string(),
  expires: z.date(),
});

export const ToTAccountSessionSchema = z.object({
  id: z.string(),

  lastActiveAt: z.date(),

  oauthSession: z.string(),
  siteSession: z.string(),
  parentId: z.string().transform(makeToTUserId),
});

export const ToTAccountSchema = z.object({
  id: z.string().transform(makeToTUserId),

  sessions: z.array(ToTAccountSessionSchema),
  sessionIds: z.array(z.string()),

  beatLeaderId: z.string().transform(makeBeatLeaderUserId).nullable(),
  beatLeader: BeatLeaderIntegrationSchema.nullable(),
});

export const ToTAccountFlatSchema = z.object({
  id: z.string().transform(makeToTUserId),
  sessionIds: z.array(z.string()),

  beatLeaderId: z.string().transform(makeBeatLeaderUserId).nullable(),
});
