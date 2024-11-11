import { HandlerForRoute } from "@/packages/api/v1/types.ts";
import {
  apiV1HandlerAuthDiscordOauthCallbackRoute,
  apiV1HandlerAuthDiscordOauthSignInRoute,
  apiV1HandlerAuthDiscordOauthSignOutRoute,
  getDiscordSessionId,
  handleDiscordCallback,
  handleDiscordSignIn,
  handleDiscordSignOut,
} from "@/packages/api/v1/auth/discord-config.ts";

export const apiV1HandlerAuthDiscordOauthSignIn: HandlerForRoute<
  typeof apiV1HandlerAuthDiscordOauthSignInRoute
> = async (req) => {
  return await handleDiscordSignIn(req);
};

export const apiV1HandlerAuthDiscordOauthSignOut: HandlerForRoute<
  typeof apiV1HandlerAuthDiscordOauthSignOutRoute
> = async (req) => {
  return await handleDiscordSignOut(req);
};

export const apiV1HandlerAuthDiscordOauthCallback: HandlerForRoute<
  typeof apiV1HandlerAuthDiscordOauthCallbackRoute
> = async (req) => {
  const { response, sessionId, tokens } = await handleDiscordCallback(req);

  return response;
};

export const isDiscordAuthorized = async (req: Request) => {
  return await getDiscordSessionId(req) !== undefined;
};
