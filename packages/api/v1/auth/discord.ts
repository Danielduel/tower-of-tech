import { createDiscordOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";
import { HandlerForRoute } from "@/packages/api/v1/types.ts";
import { isLocal } from "@/packages/utils/envrionment.ts";
import { getCookies, getSetCookies, setCookie } from "jsr:@std/http";
import { clearRight } from "https://deno.land/x/tty@0.1.4/tty_async.ts";

export const apiV1HandlerAuthDiscordOauthSignInRoute = "/api/v1/auth/discord/oauth/signin";
export const apiV1HandlerAuthDiscordOauthSignOutRoute = "/api/v1/auth/discord/oauth/signout";
export const apiV1HandlerAuthDiscordOauthCallbackRoute = "/api/v1/auth/discord/oauth/callback";

const oauthConfig = createDiscordOAuthConfig({
  redirectUri: isLocal()
    ? `http://localhost:8081${apiV1HandlerAuthDiscordOauthCallbackRoute}`
    : `https://towerofte.ch${apiV1HandlerAuthDiscordOauthCallbackRoute}`,
  scope: ["identify"],
});

const {
  signIn,
  handleCallback,
  // getSessionId,
  signOut,
} = createHelpers(oauthConfig, {
  cookieOptions: {
    sameSite: "Strict",
  },
});

export const apiV1HandlerAuthDiscordOauthSignIn: HandlerForRoute<
  typeof apiV1HandlerAuthDiscordOauthSignInRoute
> = async (req) => {
  const response = await signIn(req);

  const cookies = getSetCookies(response.headers);
  const _cookie = cookies.find((x) => x.name === "__Host-oauth-session" || x.name === "oauth-session");

  if (_cookie) {
    _cookie.sameSite = "Strict";
    setCookie(response.headers, _cookie);
  }

  console.log(cookies);

  return response;
};

export const apiV1HandlerAuthDiscordOauthSignOut: HandlerForRoute<
  typeof apiV1HandlerAuthDiscordOauthSignOutRoute
> = async (req) => {
  return await signOut(req);
};

export const apiV1HandlerAuthDiscordOauthCallback: HandlerForRoute<
  typeof apiV1HandlerAuthDiscordOauthCallbackRoute
> = async (req) => {
  const { response } = await handleCallback(req);
  return response;
};

// case "/protected-route":
//   return await getSessionId(request) === undefined
//     ? new Response("Unauthorized", { status: 401 })
//     : new Response("You are allowed");
