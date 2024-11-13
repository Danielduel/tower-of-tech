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
import {
  getAccountFromAccessTokensM,
  getDiscordCallbackStatusFromDiscordTokens,
  getExistingAccountM,
  processDiscordStatusForExistingAccount,
  processDiscordStatusForNewAccount,
  removeToTSession,
} from "@/packages/api/v1/auth/common.ts";
import { makeToTAccountSessionId } from "@/packages/types/auth.ts";

export const apiV1HandlerAuthDiscordOauthSignIn: HandlerForRoute<
  typeof apiV1HandlerAuthDiscordOauthSignInRoute
> = async (req) => {
  const currentSessionId = await getDiscordSessionId(req);
  if (currentSessionId) {
    await removeToTSession(currentSessionId);
  }
  return await handleDiscordSignIn(req);
};

export const apiV1HandlerAuthDiscordOauthSignOut: HandlerForRoute<
  typeof apiV1HandlerAuthDiscordOauthSignOutRoute
> = async (req) => {
  const currentSessionId = await getDiscordSessionId(req);
  if (currentSessionId) {
    await removeToTSession(currentSessionId);
  }
  return await handleDiscordSignOut(req);
};

export const apiV1HandlerAuthDiscordOauthCallback: HandlerForRoute<
  typeof apiV1HandlerAuthDiscordOauthCallbackRoute
> = async (req) => {
  const { response, sessionId, tokens } = await handleDiscordCallback(req);

  const existingAccountM = await getExistingAccountM(req, { discord: tokens });
  const status = await getDiscordCallbackStatusFromDiscordTokens(tokens, makeToTAccountSessionId(sessionId));

  if (existingAccountM.isOk()) {
    const existingAccount = existingAccountM.unwrap();
    processDiscordStatusForExistingAccount(existingAccount, status);
  } else {
    processDiscordStatusForNewAccount(status);
  }

  return response;
};

export const isDiscordAuthorized = async (req: Request) => {
  return await getDiscordSessionId(req) !== undefined;
};
