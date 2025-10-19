import { createHelpers } from "jsr:@deno/kv-oauth";
import { isLocal } from "@/packages/utils/envrionment.ts";
import { makeToTAccountSessionId, ToTAccountSessionId } from "@/packages/types/auth.ts";
import { BEATLEADER_API_URL } from "@/packages/api-beatleader/api.ts";

export const apiV1HandlerAuthBeatLeaderOauthCallbackRoute = "/api/v1/auth/beatleader/oauth/callback";
export const apiV1HandlerAuthBeatLeaderOauthSignInRoute = "/api/v1/auth/beatleader/oauth/signin";
export const apiV1HandlerAuthBeatLeaderOauthSignOutRoute = "/api/v1/auth/beatleader/oauth/signout";

const { getSessionId, handleCallback, signIn, signOut } = createHelpers({
  authorizationEndpointUri: `${BEATLEADER_API_URL}/oauth2/authorize`,
  tokenUri: `${BEATLEADER_API_URL}/oauth2/token`,
  clientId: Deno.env.get("BEATLEADER_CLIENT_ID")!,
  clientSecret: Deno.env.get("BEATLEADER_CLIENT_SECRET")!,
  redirectUri: isLocal()
    ? `http://localhost:8000${apiV1HandlerAuthBeatLeaderOauthCallbackRoute}`
    : `https://www.towerofte.ch${apiV1HandlerAuthBeatLeaderOauthCallbackRoute}`,
  defaults: {
    scope: ["profile", "offline_access"],
  },
}, {
  cookieOptions: {
    name: "authorization-BeatLeader",
  },
});

export const handleBeatLeaderCallback = handleCallback;
export const handleBeatLeaderSignIn = signIn;
export const handleBeatLeaderSignOut = signOut;
export const getBeatLeaderSessionId = async (request: Request): Promise<ToTAccountSessionId | undefined> => {
  const sessionId = await getSessionId(request);
  if (typeof sessionId === "undefined") return sessionId;
  return makeToTAccountSessionId(sessionId);
};
