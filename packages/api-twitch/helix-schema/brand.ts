import { z } from "zod";
import { Brand, make } from "@/packages/deps/brand.ts";

export type PaginationCursor = Brand<string, "PaginationCursor">;
export const makePaginationCursor = (paginationCursor: string) => make<PaginationCursor>()(paginationCursor);
export const paginationCursorSchema = z.string().transform(makePaginationCursor);

export type BroadcasterId = Brand<string, "BroadcasterId">;
export const makeBroadcasterId = (broadcasterId: string) => make<BroadcasterId>()(broadcasterId);
export const broadcasterIdSchema = z.string().transform(makeBroadcasterId);

export type GameId = Brand<string, "GameId">;
export const makeGameId = (gameId: string) => make<GameId>()(gameId);
export const gameIdSchema = z.string().transform(makeGameId);

export type AppAccessToken = Brand<string, "AppAccessToken">;
export const makeAppAccessToken = (appAccessToken: string) => make<AppAccessToken>()(appAccessToken);
export const appAccessTokenSchema = z.string().transform(makeAppAccessToken);

export type AppAccessTokenHeader = Brand<string, "AppAccessTokenHeader">;
export const makeAppAccessTokenHeader = (appAccessTokenHeader: string) => make<AppAccessToken>()(appAccessTokenHeader);
export const appAccessTokenHeaderSchema = z.string().transform(makeAppAccessTokenHeader);

export type AppRefreshToken = Brand<string, "AppRefreshToken">;
export const makeAppRefreshToken = (appRefreshToken: string) => make<AppRefreshToken>()(appRefreshToken);
export const appRefreshTokenSchema = z.string().transform(makeAppRefreshToken);

export type UserAccessToken = Brand<string, "UserAccessToken">;
export const makeUserAccessToken = (userAccessToken: string) => make<UserAccessToken>()(userAccessToken);
export const userAccessTokenSchema = z.string().transform(makeUserAccessToken);

export type UserAccessTokenHeader = Brand<string, "UserAccessTokenHeader">;
export const makeUserAccessTokenHeader = (userAccessTokenHeader: string) =>
  make<UserAccessTokenHeader>()(userAccessTokenHeader);
export const userAccessTokenHeaderSchema = z.string().transform(makeUserAccessTokenHeader);

export type UserRefreshToken = Brand<string, "UserRefreshToken">;
export const makeUserRefreshToken = (userRefreshToken: string) => make<UserRefreshToken>()(userRefreshToken);
export const userRefreshTokenSchema = z.string().transform(makeUserRefreshToken);
