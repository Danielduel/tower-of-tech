import {
  createHelpers,
  CreateHelpersOptions,
  HandleCallbackOptions,
  OAuth2ClientConfig,
  Tokens,
} from "jsr:@deno/kv-oauth";
import { OAuth2Client } from "https://jsr.io/@deno/kv-oauth/0.11.0/vendor/deno.land/x/oauth2_client@v1.0.2/mod.ts";
import {
  TokenResponseError,
} from "https://jsr.io/@deno/kv-oauth/0.11.0/vendor/deno.land/x/oauth2_client@v1.0.2/src/errors.ts";

import { SECOND } from "jsr:@std/datetime@^0.221.0";
import { type Cookie, getCookies, setCookie } from "jsr:@std/http@^0.221.0";
import {
  COOKIE_BASE,
  getCookieName,
  isHttps,
  OAUTH_COOKIE_NAME,
  redirect,
  SITE_COOKIE_NAME,
} from "https://jsr.io/@deno/kv-oauth/0.11.0/lib/_http.ts";
import { getAndDeleteOAuthSession, setSiteSession } from "https://jsr.io/@deno/kv-oauth/0.11.0/lib/_kv.ts";

import { isLocal } from "@/packages/utils/envrionment.ts";
import { makeToTAccountSessionId, ToTAccountSessionId } from "@/packages/types/auth.ts";
import {
  channelManageAds,
  channelManageBroadcast,
  channelManageRedemptions,
  channelReadAds,
  channelReadRedemptions,
  moderatorManageAnnouncements,
  moderatorManageShoutouts,
} from "@/packages/api-twitch/helix/scopes.ts";
import { createScopes } from "@/packages/api-twitch/helix/scopes.ts";

interface AccessTokenResponse {
  "access_token": string;
  "token_type": string;
  "expires_in"?: number;
  "refresh_token"?: string;
  scope?: string;
}

export const apiV1HandlerAuthTwitchOauthCallbackRoute = "/api/v1/auth/twitch/oauth/callback";
export const apiV1HandlerAuthTwitchOauthSignInRoute = "/api/v1/auth/twitch/oauth/signin";
export const apiV1HandlerAuthTwitchOauthSignOutRoute = "/api/v1/auth/twitch/oauth/signout";

const clientId = Deno.env.get("TWITCH_API_CLIENT_ID")!;
const clientSecret = Deno.env.get("TWITCH_API_CLIENT_SECRET")!;
const redirectUri = isLocal()
  ? `http://localhost:8081${apiV1HandlerAuthTwitchOauthCallbackRoute}`
  : `https://www.towerofte.ch${apiV1HandlerAuthTwitchOauthCallbackRoute}`;

const scope = createScopes(
  channelManageBroadcast,
  channelReadRedemptions,
  channelReadAds,
  channelManageAds,
  channelManageRedemptions,
  moderatorManageShoutouts,
  moderatorManageAnnouncements,
);

const _oauthConfig: OAuth2ClientConfig = {
  authorizationEndpointUri: "https://id.twitch.tv/oauth2/authorize",
  tokenUri: "https://id.twitch.tv/oauth2/token",
  clientId,
  clientSecret,
  redirectUri: redirectUri,
  defaults: {
    requestOptions: {
      urlParams: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: encodeURI(redirectUri),
        response_type: "authorization_code",
      },
    },
    scope,
  },
};

const handleCallbackOptions: CreateHelpersOptions = {
  cookieOptions: {
    name: "authorization-Twitch",
  },
};

const { getSessionId, signIn, signOut } = createHelpers(_oauthConfig, handleCallbackOptions);

// request, oauthConfig, { cookieOptions: options?.cookieOptions }
const handleCallback = async (
  request: Request,
  oauthConfig: OAuth2ClientConfig,
  options?: HandleCallbackOptions,
): Promise<{
  response: Response;
  sessionId: string;
  tokens: Tokens;
}> => {
  const oauthCookieName = getCookieName(
    OAUTH_COOKIE_NAME,
    isHttps(request.url),
  );
  const oauthSessionId = getCookies(request.headers)[oauthCookieName];
  if (oauthSessionId === undefined) throw new Error("OAuth cookie not found");
  const oauthSession = await getAndDeleteOAuthSession(oauthSessionId);

  const codeGrant = new OAuth2Client(oauthConfig).code;

  // HACK for fitting this whole util into twitch being not following scope standard Kappa
  codeGrant["parseTokenResponse"] = async function (response: Response) {
    if (!response.ok) {
      throw await codeGrant["getTokenResponseError"](response);
    }

    let body: AccessTokenResponse;
    try {
      body = await response.clone().json();
    } catch {
      throw new TokenResponseError(
        "Response is not JSON encoded",
        response,
      );
    }

    if (typeof body !== "object" || Array.isArray(body) || body === null) {
      throw new TokenResponseError(
        "body is not a JSON object",
        response,
      );
    }
    if (typeof body.access_token !== "string") {
      throw new TokenResponseError(
        body.access_token ? "access_token is not a string" : "missing access_token",
        response,
      );
    }
    if (typeof body.token_type !== "string") {
      throw new TokenResponseError(
        body.token_type ? "token_type is not a string" : "missing token_type",
        response,
      );
    }
    if (
      body.refresh_token !== undefined &&
      typeof body.refresh_token !== "string"
    ) {
      throw new TokenResponseError(
        "refresh_token is not a string",
        response,
      );
    }
    if (
      body.expires_in !== undefined && typeof body.expires_in !== "number"
    ) {
      throw new TokenResponseError(
        "expires_in is not a number",
        response,
      );
    }

    if (Array.isArray(body.scope)) {
      body.scope = body.scope.join(" ");
    }

    if (body.scope !== undefined && typeof body.scope !== "string") {
      throw new TokenResponseError(
        "scope is not a string",
        response,
      );
    }

    const tokens: Tokens = {
      accessToken: body.access_token,
      tokenType: body.token_type,
    };

    if (body.refresh_token) {
      tokens.refreshToken = body.refresh_token;
    }
    if (body.expires_in) {
      tokens.expiresIn = body.expires_in;
    }
    if (body.scope) {
      tokens.scope = body.scope.split(" ");
    }

    return tokens;
  };
  codeGrant.getToken = async function (
    authResponseUri: string | URL,
    options = {},
  ): Promise<Tokens> {
    const validated = await codeGrant["validateAuthorizationResponse"](
      codeGrant["toUrl"](authResponseUri),
      options,
    );

    const request = codeGrant["buildAccessTokenRequest"](
      validated.code,
      options.codeVerifier,
      options.requestOptions,
    );

    const accessTokenResponse = await fetch(request);

    return codeGrant["parseTokenResponse"](accessTokenResponse);
  };
  const tokens = await codeGrant.getToken(request.url, oauthSession);

  const sessionId = crypto.randomUUID();
  const response = redirect(oauthSession.successUrl);
  const cookie: Cookie = {
    ...COOKIE_BASE,
    name: getCookieName(SITE_COOKIE_NAME, isHttps(request.url)),
    value: sessionId,
    secure: isHttps(request.url),
    ...options?.cookieOptions,
  };
  setCookie(response.headers, cookie);
  await setSiteSession(
    sessionId,
    cookie.maxAge ? cookie.maxAge * SECOND : undefined,
  );

  return {
    response,
    sessionId,
    tokens,
  };
};

export const handleTwitchCallback = async (request: Request) => {
  return handleCallback(request, _oauthConfig, handleCallbackOptions);
};
export const handleTwitchSignIn = signIn;
export const handleTwitchSignOut = signOut;
export const getTwitchSessionId = async (request: Request): Promise<ToTAccountSessionId | undefined> => {
  const sessionId = await getSessionId(request);
  if (typeof sessionId === "undefined") return sessionId;
  return makeToTAccountSessionId(sessionId);
};
