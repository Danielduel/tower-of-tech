import { z } from "zod";
import { Brand, make } from "@/packages/deps/brand.ts";

export type DiscordUserId = Brand<string, "DiscordUserId">;
export const makeDiscordUserId = make<DiscordUserId>();
export const discordUserIdSchema = z.string().transform(makeDiscordUserId);

export type DiscordUserAccessToken = Brand<string, "DiscordUserAccessToken">;
export const makeDiscordUserAccessToken = make<DiscordUserAccessToken>();
export const discordUserAccessTokenSchema = z.string().transform(makeDiscordUserAccessToken);

export type DiscordUserAccessTokenHeader = Brand<string, "DiscordUserAccessTokenHeader">;
export const makeDiscordUserAccessTokenHeader = (discordUserAccessTokenHeader: string) =>
  make<DiscordUserAccessTokenHeader>()(discordUserAccessTokenHeader);
export const discordUserAccessTokenHeaderSchema = z.string().transform(makeDiscordUserAccessTokenHeader);

export type DiscordUserRefreshToken = Brand<string, "DiscordUserRefreshToken">;
export const makeDiscordUserRefreshToken = make<DiscordUserRefreshToken>();
export const discordUserRefreshTokenSchema = z.string().transform(makeDiscordUserRefreshToken);
