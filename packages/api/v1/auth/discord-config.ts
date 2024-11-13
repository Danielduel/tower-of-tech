import { createDiscordOAuthConfig, createHelpers } from "jsr:@deno/kv-oauth";
import { isLocal } from "@/packages/utils/envrionment.ts";
import { makeToTAccountSessionId, ToTAccountSessionId } from "@/packages/types/auth.ts";

export const apiV1HandlerAuthDiscordOauthSignInRoute = "/api/v1/auth/discord/oauth/signin";
export const apiV1HandlerAuthDiscordOauthSignOutRoute = "/api/v1/auth/discord/oauth/signout";
export const apiV1HandlerAuthDiscordOauthCallbackRoute = "/api/v1/auth/discord/oauth/callback";

const oauthConfig = createDiscordOAuthConfig({
  redirectUri: isLocal()
    ? `http://localhost:8081${apiV1HandlerAuthDiscordOauthCallbackRoute}`
    : `https://www.towerofte.ch${apiV1HandlerAuthDiscordOauthCallbackRoute}`,
  scope: ["identify"],
});

const {
  signIn,
  handleCallback,
  getSessionId,
  signOut,
} = createHelpers(oauthConfig, {
  cookieOptions: {
    name: "authorization-Discord",
  },
});

export const handleDiscordCallback = handleCallback;
export const handleDiscordSignIn = signIn;
export const handleDiscordSignOut = signOut;
export const getDiscordSessionId = async (request: Request): Promise<ToTAccountSessionId | undefined> => {
  const sessionId = await getSessionId(request);
  if (typeof sessionId === "undefined") return sessionId;
  return makeToTAccountSessionId(sessionId);
};
