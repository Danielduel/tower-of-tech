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
  getBeatLeaderCallbackStatusFromBeatLeaderTokens,
  getExistingAccountM,
  processBeatLeaderStatusForExistingAccount,
  processBeatLeaderStatusForNewAccount,
  removeToTSession,
} from "@/packages/api/v1/auth/common.ts";
import { makeToTAccountSessionId } from "@/packages/types/auth.ts";

export const apiV1HandlerAuthBeatLeaderOauthSignIn = async (req) => {
  const currentSessionId = await getBeatLeaderSessionId(req);
  if (currentSessionId) {
    await removeToTSession(currentSessionId);
  }
  return await handleBeatLeaderSignIn(req);
};

export const apiV1HandlerAuthBeatLeaderOauthSignOut = async (req) => {
  const currentSessionId = await getBeatLeaderSessionId(req);
  if (currentSessionId) {
    await removeToTSession(currentSessionId);
  }
  return await handleBeatLeaderSignOut(req);
};

export const apiV1HandlerAuthBeatLeaderOauthCallback = async (req) => {
  const { response, sessionId, tokens } = await handleBeatLeaderCallback(req);

  const existingAccountM = await getExistingAccountM(req, { beatLeader: tokens });
  const status = await getBeatLeaderCallbackStatusFromBeatLeaderTokens(tokens, makeToTAccountSessionId(sessionId));

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
