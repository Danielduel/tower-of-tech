import { HandlerForRoute } from "@/packages/api/v1/types.ts";
import {
  apiV1HandlerAuthBeatLeaderOauthCallbackRoute,
  apiV1HandlerAuthBeatLeaderOauthSignInRoute,
  apiV1HandlerAuthBeatLeaderOauthSignOutRoute,
  getBeatLeaderSessionId,
  handleBeatLeaderCallback,
  handleBeatLeaderSignIn,
  handleBeatLeaderSignOut,
} from "@/packages/api/v1/auth/beatleader-config.ts";
import {
  getAccountFromAccessTokensM,
  getBeatLeaderCallbackStatusFromBeatLeaderTokens,
  processBeatLeaderStatusForExistingAccount,
  processBeatLeaderStatusForNewAccount,
  removeToTSession,
} from "@/packages/api/v1/auth/common.ts";
import { makeToTSessionId } from "@/packages/types/auth.ts";

export const apiV1HandlerAuthBeatLeaderOauthSignIn: HandlerForRoute<
  typeof apiV1HandlerAuthBeatLeaderOauthSignInRoute
> = async (req) => {
  const currentSessionId = await getBeatLeaderSessionId(req);
  if (currentSessionId) {
    await removeToTSession(currentSessionId);
  }
  return await handleBeatLeaderSignIn(req);
};

export const apiV1HandlerAuthBeatLeaderOauthSignOut: HandlerForRoute<
  typeof apiV1HandlerAuthBeatLeaderOauthSignOutRoute
> = async (req) => {
  return await handleBeatLeaderSignOut(req);
};

export const apiV1HandlerAuthBeatLeaderOauthCallback: HandlerForRoute<
  typeof apiV1HandlerAuthBeatLeaderOauthCallbackRoute
> = async (req) => {
  const { response, sessionId, tokens } = await handleBeatLeaderCallback(req);

  const existingAccountM = await getAccountFromAccessTokensM({ beatLeader: tokens });
  const status = await getBeatLeaderCallbackStatusFromBeatLeaderTokens(tokens, makeToTSessionId(sessionId));

  if (existingAccountM.isOk()) {
    const existingAccount = existingAccountM.unwrap();
    processBeatLeaderStatusForExistingAccount(existingAccount, status);
  } else {
    processBeatLeaderStatusForNewAccount(status);
  }

  return response;
};

export const isBeatLeaderAuthorized = async (req: Request) => {
  return await getBeatLeaderSessionId(req) !== undefined;
};
