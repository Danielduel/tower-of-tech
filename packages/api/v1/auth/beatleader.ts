import { createHelpers } from "jsr:@deno/kv-oauth";
import { HandlerForRoute } from "@/packages/api/v1/types.ts";
import { isLocal } from "@/packages/utils/envrionment.ts";

export const apiV1HandlerAuthBeatLeaderOauthSignInRoute = "/api/v1/auth/beatleader/oauth/signin";
export const apiV1HandlerAuthBeatLeaderOauthSignOutRoute = "/api/v1/auth/beatleader/oauth/signout";
export const apiV1HandlerAuthBeatLeaderOauthCallbackRoute = "/api/v1/auth/beatleader/oauth/callback";

const { getSessionId, handleCallback, signIn, signOut } = createHelpers({
  authorizationEndpointUri: "https://api.beatleader.xyz/oauth2/authorize",
  tokenUri: "https://api.beatleader.xyz/oauth2/token",
  clientId: Deno.env.get("BEATLEADER_CLIENT_ID")!,
  clientSecret: Deno.env.get("BEATLEADER_CLIENT_SECRET")!,
  redirectUri: isLocal()
    ? `http://localhost:8081${apiV1HandlerAuthBeatLeaderOauthCallbackRoute}`
    : `https://www.towerofte.ch${apiV1HandlerAuthBeatLeaderOauthCallbackRoute}`,
  defaults: {
    scope: ["profile", "offline_access"],
  },
});

const fetchIdentity = async (token: string) => {
  return await fetch("https://api.beatleader.xyz/oauth2/identity", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
};

export const apiV1HandlerAuthBeatLeaderOauthSignIn: HandlerForRoute<
  typeof apiV1HandlerAuthBeatLeaderOauthSignInRoute
> = async (req) => {
  return await signIn(req);
};

export const apiV1HandlerAuthBeatLeaderOauthSignOut: HandlerForRoute<
  typeof apiV1HandlerAuthBeatLeaderOauthSignOutRoute
> = async (req) => {
  return await signOut(req);
};

export const apiV1HandlerAuthBeatLeaderOauthCallback: HandlerForRoute<
  typeof apiV1HandlerAuthBeatLeaderOauthCallbackRoute
> = async (req) => {
  const { response, sessionId, tokens } = await handleCallback(req);

  console.log(tokens);

  const data = await fetchIdentity(tokens.accessToken);

  console.log(data);

  return response;
};

export const isBeatLeaderAuthorized = async (req: Request) => {
  return await getSessionId(req) === undefined;
};
