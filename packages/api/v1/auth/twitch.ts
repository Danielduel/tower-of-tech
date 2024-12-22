import { HandlerForRoute } from "@/packages/api/v1/types.ts";
import {
  apiV1HandlerAuthTwitchOauthCallbackRoute,
  apiV1HandlerAuthTwitchOauthSignInRoute,
  apiV1HandlerAuthTwitchOauthSignOutRoute,
  getTwitchSessionId,
  handleTwitchCallback,
  handleTwitchSignIn,
  handleTwitchSignOut,
} from "@/packages/api/v1/auth/twitch-config.ts";
import {
  getExistingAccountM,
  getTwitchCallbackStatusFromTwitchTokens,
  processTwitchStatusForExistingAccount,
  processTwitchStatusForNewAccount,
  removeToTSession,
} from "@/packages/api/v1/auth/common.ts";
import { makeToTAccountSessionId } from "@/packages/types/auth.ts";

export const apiV1HandlerAuthTwitchOauthSignIn: HandlerForRoute<
  typeof apiV1HandlerAuthTwitchOauthSignInRoute
> = async (req) => {
  const currentSessionId = await getTwitchSessionId(req);
  if (currentSessionId) {
    await removeToTSession(currentSessionId);
  }
  return await handleTwitchSignIn(req);
};

export const apiV1HandlerAuthTwitchOauthSignOut: HandlerForRoute<
  typeof apiV1HandlerAuthTwitchOauthSignOutRoute
> = async (req) => {
  const currentSessionId = await getTwitchSessionId(req);
  if (currentSessionId) {
    await removeToTSession(currentSessionId);
  }
  return await handleTwitchSignOut(req);
};

export const apiV1HandlerAuthTwitchOauthCallback: HandlerForRoute<
  typeof apiV1HandlerAuthTwitchOauthCallbackRoute
> = async (req) => {
  const { response, sessionId, tokens } = await handleTwitchCallback(req);

  const existingAccountM = await getExistingAccountM(req, { beatLeader: tokens });
  const status = await getTwitchCallbackStatusFromTwitchTokens(tokens, makeToTAccountSessionId(sessionId));

  if (existingAccountM.isOk()) {
    const existingAccount = existingAccountM.unwrap();
    processTwitchStatusForExistingAccount(existingAccount, status);
  } else {
    processTwitchStatusForNewAccount(status);
  }

  return response;
};

export const isTwitchAuthorized = async (req: Request) => {
  return await getTwitchSessionId(req) !== undefined;
};
