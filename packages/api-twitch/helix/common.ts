import { z, type ZodTypeAny } from "zod";
import {
  appAccessTokenHeaderSchema,
  appAccessTokenSchema,
  makeAppAccessTokenHeader,
  makeUserAccessTokenHeader,
  paginationCursorSchema,
  userAccessTokenHeaderSchema,
  userAccessTokenSchema,
  userRefreshTokenSchema,
} from "@/packages/api-twitch/helix/brand.ts";
import { AppAccessToken, UserAccessToken } from "@/packages/api-twitch/helix/brand.ts";

export const appAuthHeadersSchema = z.object({
  Authorization: appAccessTokenHeaderSchema,
  "Client-Id": z.string(),
});
export type AppAuthHeadersSchemaT = typeof appAuthHeadersSchema._type;

export const userAuthHeadersSchema = z.object({
  Authorization: userAccessTokenHeaderSchema,
  "Client-Id": z.string(),
});
export type UserAuthHeadersSchemaT = typeof userAuthHeadersSchema._type;

const createClientIdHeader = (clientId: string) => ({ "Client-Id": clientId });
const createAppAuthorization = (appAuthToken: AppAccessToken) => ({
  Authorization: makeAppAccessTokenHeader(`Bearer ${appAuthToken}`),
});
const createUserAuthorization = (userAuthToken: UserAccessToken) => ({
  Authorization: makeUserAccessTokenHeader(`Bearer ${userAuthToken}`),
});

export const createAppAuthorizationHeaders = (
  clientId: string,
  appAuthToken: AppAccessToken,
): AppAuthHeadersSchemaT => ({
  ...createAppAuthorization(appAuthToken),
  ...createClientIdHeader(clientId),
});

export const createUserAuthorizationHeaders = (
  clientId: string,
  userAuthToken: UserAccessToken,
): UserAuthHeadersSchemaT => ({
  ...createUserAuthorization(userAuthToken),
  ...createClientIdHeader(clientId),
});

export const responseSchemaWrapper = <T extends ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
  });

export const paginatedResponseSchemaWrapper = <T extends ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    pagination: z.object({
      cursor: paginationCursorSchema.optional(),
    }),
  });

export const userTokenSuccessSchema = z.object({
  access_token: userAccessTokenSchema,
  refresh_token: userRefreshTokenSchema,
  expires_in: z.number(),
  scope: z.array(z.string()),
  token_type: z.string(),
});
export type UserTokenSuccessSchemaT = typeof userTokenSuccessSchema._type;

export const appTokenSuccessSchema = z.object({
  access_token: appAccessTokenSchema,
  expires_in: z.number(),
  token_type: z.string(),
});
export type AppTokenSuccessSchemaT = typeof appTokenSuccessSchema._type;
