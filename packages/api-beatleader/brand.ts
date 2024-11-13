import { z } from "zod";
import { Brand, make } from "@/packages/deps/brand.ts";

export type BeatLeaderUserId = Brand<string, "BeatLeaderUserId">;
export const makeBeatLeaderUserId = make<BeatLeaderUserId>();
export const beatLeaderUserIdSchema = z.string().transform(makeBeatLeaderUserId);

export type BeatLeaderUserAccessToken = Brand<string, "BeatLeaderUserAccessToken">;
export const makeBeatLeaderUserAccessToken = make<BeatLeaderUserAccessToken>();
export const beatLeaderUserAccessTokenSchema = z.string().transform(makeBeatLeaderUserAccessToken);

export type BeatLeaderUserAccessTokenHeader = Brand<string, "BeatLeaderUserAccessTokenHeader">;
export const makeBeatLeaderUserAccessTokenHeader = (beatLeaderUserAccessTokenHeader: string) =>
  make<BeatLeaderUserAccessTokenHeader>()(beatLeaderUserAccessTokenHeader);
export const beatLeaderUserAccessTokenHeaderSchema = z.string().transform(makeBeatLeaderUserAccessTokenHeader);

export type BeatLeaderUserRefreshToken = Brand<string, "BeatLeaderUserRefreshToken">;
export const makeBeatLeaderUserRefreshToken = make<BeatLeaderUserRefreshToken>();
export const beatLeaderUserRefreshTokenSchema = z.string().transform(makeBeatLeaderUserRefreshToken);
