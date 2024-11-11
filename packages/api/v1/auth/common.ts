import {
  BeatLeaderIntegrationSafeSchemaT,
  BeatLeaderIntegrationSchemaT,
  makeToTAccountId,
  ToTAccountFlatSchemaT,
  ToTAccountId,
  ToTAccountSafeSchemaT,
  ToTAccountSchemaT,
  ToTAccountSessionSchemaT,
  ToTSessionId,
} from "@/packages/types/auth.ts";
import { dbEditor } from "@/packages/database-editor/mod.ts";
import { Err, Ok, Result } from "@/packages/utils/optionals.ts";
import { getBeatLeaderSessionId } from "@/packages/api/v1/auth/beatleader-config.ts";
import { getDiscordSessionId } from "@/packages/api/v1/auth/discord-config.ts";
import { filterUndefineds } from "@/packages/utils/filter.ts";
import { Tokens } from "jsr:@deno/kv-oauth";
import {
  BeatLeaderUserAccessToken,
  makeBeatLeaderUserAccessToken,
  makeBeatLeaderUserRefreshToken,
} from "@/packages/api-beatleader/brand.ts";
import { BeatLeaderApi, BeatLeaderApiOauthIdentityBodySchemaT } from "@/packages/api-beatleader/api.ts";
import { createBeatLeaderUserAuthHeaders } from "@/packages/api-beatleader/common.ts";
import { ulid } from "@/packages/deps/ulid.ts";

const getSessionFromSessionId = async (sessionId: ToTSessionId) => {
  return await dbEditor.ToTAccountSession.find(sessionId);
};

const getAccountFromAccountId = async (accountId: ToTAccountId) => {
  return await dbEditor.ToTAccount.find(accountId);
};

const getAccountFromSessionId = async (sessionId: ToTSessionId) => {
  const session = await getSessionFromSessionId(sessionId);
  if (session) {
    const { parentId } = session.value;
    if (parentId) {
      const account = await getAccountFromAccountId(parentId);
      if (account) {
        return account.value;
      }
    }
  }
};

const _getSessionFromSessionIds = async function* (sessionIds: ToTSessionId[]) {
  for (const sessionId of sessionIds) {
    const session = await getSessionFromSessionId(sessionId);
    yield session?.value;
  }
};

const _getAccountFromSessionIds = async function* (sessionIds: ToTSessionId[]) {
  for (const sessionId of sessionIds) {
    yield await getAccountFromSessionId(sessionId);
  }
};

const getAccountFromSessionIds = async (sessionIds: ToTSessionId[]) => {
  for await (const account of _getAccountFromSessionIds(sessionIds)) {
    if (account) {
      return account;
    }
  }
};

const getSessionIdsFromRequest = async (request: Request): Promise<ToTSessionId[]> => {
  return [
    ...new Set([
      await getBeatLeaderSessionId(request) as ToTSessionId | undefined,
      await getDiscordSessionId(request) as ToTSessionId | undefined,
    ].filter(filterUndefineds)),
  ];
};

export const getAccountFromRequestM = async (request: Request): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const sessionIds = await getSessionIdsFromRequest(request);
  const account = await getAccountFromSessionIds(sessionIds);

  if (account) {
    return Ok(account);
  }

  return Err(Error("Account not found"));
};

export const _getFullAccountFromRequestM = async (
  request: Request,
): Promise<Result<ToTAccountSchemaT, Error>> => {
  const accountM = await getAccountFromRequestM(request);
  if (accountM.isErr()) {
    return Err(accountM.unwrapErr());
  }
  const account = accountM.unwrap();

  const sessions = (await Array.fromAsync(_getSessionFromSessionIds(account.sessionIds))).filter(filterUndefineds);
  const beatLeaderR = account.beatLeaderId ? await dbEditor.BeatLeaderIntegration.find(account.beatLeaderId) : null;
  const beatLeader = beatLeaderR ? beatLeaderR.value : null;

  return Ok({
    ...account,
    sessions,
    beatLeader,
  });
};

export const beatLeaderIntegrationToBeatLeaderIntegrationSafe = (
  x: BeatLeaderIntegrationSchemaT,
): BeatLeaderIntegrationSafeSchemaT => {
  const copy: BeatLeaderIntegrationSafeSchemaT = { ...x, expires: [][0], accessToken: [][0], refreshToken: [][0] };
  return copy;
};

export const getFullAccountFromRequestM = async (
  request: Request,
): Promise<Result<ToTAccountSafeSchemaT, Error>> => {
  const accountM = await _getFullAccountFromRequestM(request);
  if (accountM.isErr()) {
    return Err(accountM.unwrapErr());
  }
  const account = accountM.unwrap();
  const beatLeader = account.beatLeader ? beatLeaderIntegrationToBeatLeaderIntegrationSafe(account.beatLeader) : null;
  return Ok({
    ...account,
    beatLeader,
  });
};

type AllTokens = {
  beatLeader?: Tokens;
  discord?: Tokens;
};

type BeatLeaderCallbackStatus = {
  account: ToTAccountFlatSchemaT | null;
  integration: BeatLeaderIntegrationSchemaT | null;
  identity: BeatLeaderApiOauthIdentityBodySchemaT | null;
  tokens: Tokens;
  sessionId: ToTSessionId;
};

const getBeatLeaderIdentityM = async (
  token: BeatLeaderUserAccessToken,
): Promise<Result<BeatLeaderApiOauthIdentityBodySchemaT, Error>> => {
  const { data, ok } = await BeatLeaderApi.oauthIdentity.get({
    headers: createBeatLeaderUserAuthHeaders(token),
  });

  if (ok) {
    return Ok(data);
  }

  return Err(Error("Failed to get beatleader identity"));
};

const getAccountFromBeatLeaderConnectedAccount = async (
  beatLeaderIdentity: BeatLeaderApiOauthIdentityBodySchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const beatLeaderConnectedAccounts = await dbEditor.ToTAccount.findBySecondaryIndex(
    "beatLeaderId",
    beatLeaderIdentity.id,
  );
  const beatLeaderConnectedAccountFound = beatLeaderConnectedAccounts.result.length > 0;
  if (beatLeaderConnectedAccountFound) {
    const [connectedAccount] = beatLeaderConnectedAccounts.result;
    return Ok(connectedAccount.value);
  }
  return Err(Error("Can't find beatleader connected account"));
};

const getBeatLeaderIntegrationFromBeatLeaderIdentity = async (
  beatLeaderIdentity: BeatLeaderApiOauthIdentityBodySchemaT,
): Promise<Result<BeatLeaderIntegrationSchemaT, Error>> => {
  const beatLeaderIntegration = await dbEditor.BeatLeaderIntegration.find(beatLeaderIdentity.id);
  if (beatLeaderIntegration) {
    return Ok(beatLeaderIntegration.value);
  }
  return Err(Error("Can't find beatleader integration"));
};

const getAccountFromBeatLeaderIntegrationM = async (
  beatLeaderIntegration: BeatLeaderIntegrationSchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const account = await dbEditor.ToTAccount.find(beatLeaderIntegration.parentId);
  if (account) {
    return Ok(account.value);
  }
  return Err(Error("Can't find the account from beatleader integration"));
};

const getAccountFromBeatLeaderIdentityM = async (
  beatLeaderIdentity: BeatLeaderApiOauthIdentityBodySchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const beatLeaderIntegrationM = await getBeatLeaderIntegrationFromBeatLeaderIdentity(beatLeaderIdentity);
  if (beatLeaderIntegrationM.isOk()) {
    const beatLeaderIntegration = beatLeaderIntegrationM.unwrap();
    const accountM = await getAccountFromBeatLeaderIntegrationM(beatLeaderIntegration);
    if (accountM.isOk()) {
      return accountM;
    }
  }
  return Err(Error("Can't find account from beatleader integration"));
};

const getAccountFromBeatLeaderTokensM = async (tokens: Tokens): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const beatLeaderIdentityM = await getBeatLeaderIdentityM(makeBeatLeaderUserAccessToken(tokens.accessToken));
  if (beatLeaderIdentityM.isErr()) {
    return Err(Error("Can't fetch beatleader identity using this access token"));
  }
  const beatLeaderIdentity = beatLeaderIdentityM.unwrap();

  const connectedAccountM = await getAccountFromBeatLeaderConnectedAccount(beatLeaderIdentity);
  if (connectedAccountM.isOk()) {
    return Ok(connectedAccountM.unwrap());
  }

  const integrationAccountM = await getAccountFromBeatLeaderIdentityM(beatLeaderIdentity);
  if (integrationAccountM.isOk()) {
    return Ok(integrationAccountM.unwrap());
  }

  return Err(Error("Can't find account from beatleader tokens"));
};

export const getAccountFromAccessTokensM = async (tokens: AllTokens): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  if (tokens.beatLeader) {
    const accountM = await getAccountFromBeatLeaderTokensM(tokens.beatLeader);
    if (accountM.isOk()) {
      return accountM;
    }
  }

  return Err(Error("Account not found"));
};

export const getBeatLeaderCallbackStatusFromBeatLeaderTokens = async (tokens: Tokens, sessionId: ToTSessionId): Promise<
  BeatLeaderCallbackStatus
> => {
  const identityM = await getBeatLeaderIdentityM(makeBeatLeaderUserAccessToken(tokens.accessToken));
  if (identityM.isErr()) {
    return {
      identity: null,
      account: null,
      integration: null,
      tokens,
      sessionId,
    };
  }
  const identity = identityM.unwrap();

  const integrationM = await getBeatLeaderIntegrationFromBeatLeaderIdentity(identity);
  if (integrationM.isErr()) {
    const accountM = await getAccountFromBeatLeaderConnectedAccount(identity);
    if (accountM.isErr()) {
      return {
        identity,
        account: null,
        integration: null,
        tokens,
        sessionId,
      };
    }
    const account = accountM.unwrap();
    return {
      identity,
      account,
      integration: null,
      tokens,
      sessionId,
    };
  }
  const integration = integrationM.unwrap();

  const accountM = await getAccountFromBeatLeaderIntegrationM(integration);
  if (accountM.isErr()) {
    return {
      identity,
      integration,
      account: null,
      tokens,
      sessionId,
    };
  }
  const account = accountM.unwrap();

  return {
    identity,
    account,
    integration,
    tokens,
    sessionId,
  };
};

export const processBeatLeaderStatusForNewAccount = async (
  status: BeatLeaderCallbackStatus,
) => {
  if (!status.identity) return;

  if (!status.account && !status.integration) {
    console.log("Creating new account");
    const accountId = makeToTAccountId(ulid());
    const account = await dbEditor.ToTAccount.add({
      id: accountId,
      version: 0,
      beatLeaderId: status.identity.id,
      sessionIds: [status.sessionId],
    });
    const accountSession = await dbEditor.ToTAccountSession.add({
      id: status.sessionId,
      parentId: accountId,
      lastActiveAt: new Date(),
    });
    const beatLeaderIntegration = await dbEditor.BeatLeaderIntegration.add({
      id: status.identity.id,
      parentId: accountId,

      name: status.identity.name,

      expires: new Date(Date.now() + status.tokens.expiresIn!),
      refreshToken: makeBeatLeaderUserRefreshToken(status.tokens.refreshToken!),
      accessToken: makeBeatLeaderUserAccessToken(status.tokens.accessToken),
    });
    return;
  }
};

export const processBeatLeaderStatusForExistingAccount = async (
  existingAccount: ToTAccountFlatSchemaT,
  status: BeatLeaderCallbackStatus,
) => {
  if (status.account) {
    if (existingAccount.id === status.account.id) {
      await addToTAccountSession(status.sessionId, existingAccount);
    }
  }
};

export const removeToTSession = async (sessionId: ToTSessionId) => {
  console.log(`Removing session ${sessionId}`);
  const session = await getSessionFromSessionId(sessionId);
  if (session) {
    const account = await getAccountFromAccountId(session.value.parentId);
    if (account) {
      await dbEditor.ToTAccount.update(account.id, {
        sessionIds: account.value.sessionIds.filter((x) => x !== sessionId),
      }, { strategy: "merge-shallow" });
    }
    await dbEditor.ToTAccountSession.delete(session.id);
  }
  return;
};

const createToTAccountSession = (
  id: ToTSessionId,
  parentId: ToTAccountId,
  lastActiveAt = new Date(),
): ToTAccountSessionSchemaT => {
  return {
    id,
    parentId,
    lastActiveAt,
  };
};

export const addToTAccountSession = async (
  id: ToTSessionId,
  account: ToTAccountFlatSchemaT,
  lastActiveAt = new Date(),
) => {
  await dbEditor.ToTAccount.update(account.id, {
    sessionIds: [...account.sessionIds, id],
  }, { strategy: "merge-shallow" });
  await dbEditor.ToTAccountSession.add(createToTAccountSession(id, account.id, lastActiveAt));
  return;
};
