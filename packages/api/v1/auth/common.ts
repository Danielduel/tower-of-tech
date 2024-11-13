import {
  BeatLeaderIntegrationSafeSchemaT,
  BeatLeaderIntegrationSchemaT,
  DiscordIntegrationSafeSchemaT,
  DiscordIntegrationSchemaT,
  makeToTAccountId,
  ToTAccountFlatSchemaT,
  ToTAccountId,
  ToTAccountSafeSchemaT,
  ToTAccountSchemaT,
  ToTAccountSessionId,
  ToTAccountSessionSchemaT,
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
import {
  DiscordUserAccessToken,
  makeDiscordUserAccessToken,
  makeDiscordUserRefreshToken,
} from "@/packages/api-discord/brand.ts";
import { DiscordApi, DiscordApiUsersMeBodySchemaT } from "@/packages/api-discord/api.ts";
import { createDiscordUserAuthHeaders } from "@/packages/api-discord/common.ts";

const getSessionFromSessionId = async (sessionId: ToTAccountSessionId) => {
  return await dbEditor.ToTAccountSession.find(sessionId);
};

const getAccountFromAccountId = async (accountId: ToTAccountId) => {
  return await dbEditor.ToTAccount.find(accountId);
};

const getAccountFromSessionId = async (sessionId: ToTAccountSessionId) => {
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

const _getSessionFromSessionIds = async function* (sessionIds: ToTAccountSessionId[]) {
  for (const sessionId of sessionIds) {
    const session = await getSessionFromSessionId(sessionId);
    yield session?.value;
  }
};

const _getAccountFromSessionIds = async function* (sessionIds: ToTAccountSessionId[]) {
  for (const sessionId of sessionIds) {
    yield await getAccountFromSessionId(sessionId);
  }
};

const getAccountFromSessionIds = async (sessionIds: ToTAccountSessionId[]) => {
  for await (const account of _getAccountFromSessionIds(sessionIds)) {
    if (account) {
      return account;
    }
  }
};

const getSessionIdsFromRequest = async (request: Request): Promise<ToTAccountSessionId[]> => {
  return [
    ...new Set([
      await getBeatLeaderSessionId(request) as ToTAccountSessionId | undefined,
      await getDiscordSessionId(request) as ToTAccountSessionId | undefined,
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

  const discordR = account.discordId ? await dbEditor.DiscordIntegration.find(account.discordId) : null;
  const discord = discordR ? discordR.value : null;

  return Ok({
    ...account,
    sessions,
    beatLeader,
    discord,
  });
};

export const beatLeaderIntegrationToBeatLeaderIntegrationSafe = (
  x: BeatLeaderIntegrationSchemaT,
): BeatLeaderIntegrationSafeSchemaT => {
  const copy: BeatLeaderIntegrationSafeSchemaT = { ...x, expires: [][0], accessToken: [][0], refreshToken: [][0] };
  return copy;
};

export const discordIntegrationToDiscordIntegrationSafe = (
  x: DiscordIntegrationSchemaT,
): DiscordIntegrationSafeSchemaT => {
  const copy: DiscordIntegrationSafeSchemaT = { ...x, expires: [][0], accessToken: [][0], refreshToken: [][0] };
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
  const discord = account.discord ? discordIntegrationToDiscordIntegrationSafe(account.discord) : null;

  return Ok({
    ...account,
    beatLeader,
    discord,
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
  sessionId: ToTAccountSessionId;
};

type DiscordCallbackStatus = {
  account: ToTAccountFlatSchemaT | null;
  integration: DiscordIntegrationSchemaT | null;
  identity: DiscordApiUsersMeBodySchemaT | null;
  tokens: Tokens;
  sessionId: ToTAccountSessionId;
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

const getDiscordIdentityM = async (
  token: DiscordUserAccessToken,
): Promise<Result<DiscordApiUsersMeBodySchemaT, Error>> => {
  const { data, ok } = await DiscordApi.usersMe.get({
    headers: createDiscordUserAuthHeaders(token),
  });

  if (ok) {
    return Ok(data);
  }

  return Err(Error("Failed to get discord identity"));
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

const getAccountFromDiscordConnectedAccount = async (
  discordIdentity: DiscordApiUsersMeBodySchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const discordConnectedAccounts = await dbEditor.ToTAccount.findBySecondaryIndex(
    "discordId",
    discordIdentity.id,
  );
  const discordConnectedAccountFound = discordConnectedAccounts.result.length > 0;
  if (discordConnectedAccountFound) {
    const [connectedAccount] = discordConnectedAccounts.result;
    return Ok(connectedAccount.value);
  }
  return Err(Error("Can't find discord connected account"));
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

const getDiscordIntegrationFromDiscordIdentity = async (
  discordIdentity: DiscordApiUsersMeBodySchemaT,
): Promise<Result<DiscordIntegrationSchemaT, Error>> => {
  const discordIntegration = await dbEditor.DiscordIntegration.find(discordIdentity.id);
  if (discordIntegration) {
    return Ok(discordIntegration.value);
  }
  return Err(Error("Can't find discord integration"));
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

const getAccountFromDiscordIntegrationM = async (
  discordIntegration: DiscordIntegrationSchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const account = await dbEditor.ToTAccount.find(discordIntegration.parentId);
  if (account) {
    return Ok(account.value);
  }
  return Err(Error("Can't find the account from discord integration"));
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

const getAccountFromDiscordIdentityM = async (
  discordIdentity: DiscordApiUsersMeBodySchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const discordIntegrationM = await getDiscordIntegrationFromDiscordIdentity(discordIdentity);
  if (discordIntegrationM.isOk()) {
    const discordIntegration = discordIntegrationM.unwrap();
    const accountM = await getAccountFromDiscordIntegrationM(discordIntegration);
    if (accountM.isOk()) {
      return accountM;
    }
  }
  return Err(Error("Can't find account from discord integration"));
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

const getAccountFromDiscordTokensM = async (tokens: Tokens): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const discordIdentityM = await getDiscordIdentityM(makeDiscordUserAccessToken(tokens.accessToken));
  if (discordIdentityM.isErr()) {
    return Err(Error("Can't fetch discord identity using this access token"));
  }
  const discordIdentity = discordIdentityM.unwrap();

  const connectedAccountM = await getAccountFromDiscordConnectedAccount(discordIdentity);
  if (connectedAccountM.isOk()) {
    return Ok(connectedAccountM.unwrap());
  }

  const integrationAccountM = await getAccountFromDiscordIdentityM(discordIdentity);
  if (integrationAccountM.isOk()) {
    return Ok(integrationAccountM.unwrap());
  }

  return Err(Error("Can't find account from discord tokens"));
};

export const getAccountFromAccessTokensM = async (tokens: AllTokens): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  if (tokens.beatLeader) {
    const accountM = await getAccountFromBeatLeaderTokensM(tokens.beatLeader);
    if (accountM.isOk()) {
      return accountM;
    }
  }

  if (tokens.discord) {
    const accountM = await getAccountFromDiscordTokensM(tokens.discord);
    if (accountM.isOk()) {
      return accountM;
    }
  }

  return Err(Error("Account not found"));
};

export const getExistingAccountM = async (
  request: Request,
  tokens: AllTokens,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const fromRequestM = await getAccountFromRequestM(request);
  if (fromRequestM.isOk()) {
    return fromRequestM;
  }

  const fromAccessTokensM = await getAccountFromAccessTokensM(tokens);
  if (fromAccessTokensM.isOk()) {
    return fromAccessTokensM;
  }

  return Err(Error("Account not found"));
};

export const getBeatLeaderCallbackStatusFromBeatLeaderTokens = async (
  tokens: Tokens,
  sessionId: ToTAccountSessionId,
): Promise<
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

export const getDiscordCallbackStatusFromDiscordTokens = async (
  tokens: Tokens,
  sessionId: ToTAccountSessionId,
): Promise<
  DiscordCallbackStatus
> => {
  const identityM = await getDiscordIdentityM(makeDiscordUserAccessToken(tokens.accessToken));
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

  const integrationM = await getDiscordIntegrationFromDiscordIdentity(identity);
  if (integrationM.isErr()) {
    const accountM = await getAccountFromDiscordConnectedAccount(identity);
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

  const accountM = await getAccountFromDiscordIntegrationM(integration);
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

const ensureToTAccount = async (
  account: ToTAccountFlatSchemaT | null,
  defaults: Partial<ToTAccountFlatSchemaT>,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  if (account) return Ok(account);

  console.log("Creating new ToTAccount");
  const id = defaults.id ?? makeToTAccountId(ulid());
  const version = defaults.version ?? 0;
  const beatLeaderId = defaults.beatLeaderId ?? null;
  const sessionIds = defaults.sessionIds ?? [];
  const discordId = defaults.discordId ?? null;

  const newAccount = {
    id,
    version,
    beatLeaderId,
    discordId,
    sessionIds,
  } satisfies ToTAccountFlatSchemaT;

  const resolve = await dbEditor.ToTAccount.add(newAccount);

  if (resolve.ok) {
    return Ok(newAccount);
  }

  return Err(Error("Failed to create a new ToTAccount"));
};

const ensureBeatLeaderIntegration = async (
  integration: BeatLeaderIntegrationSchemaT | null,
  defaults: BeatLeaderIntegrationSchemaT,
): Promise<Result<BeatLeaderIntegrationSchemaT, Error>> => {
  if (integration) return Ok(integration);

  console.log("Creating new BeatLeaderIntegration");
  const resolve = await dbEditor.BeatLeaderIntegration.add(defaults);

  if (resolve.ok) {
    return Ok(defaults);
  }

  return Err(Error("Failed to create a new BeatLeaderIntegration"));
};

const ensureDiscordIntegration = async (
  integration: DiscordIntegrationSchemaT | null,
  defaults: DiscordIntegrationSchemaT,
): Promise<Result<DiscordIntegrationSchemaT, Error>> => {
  if (integration) return Ok(integration);

  console.log("Creating new DiscordIntegration");

  const resolve = await dbEditor.DiscordIntegration.add(defaults);

  if (resolve.ok) {
    return Ok(defaults);
  }

  return Err(Error("Failed to create a new BeatLeaderIntegration"));
};

const ensureBeatLeaderIntegrationLink = async (
  account: ToTAccountFlatSchemaT,
  integration: BeatLeaderIntegrationSchemaT,
) => {
  const isChild = account.beatLeaderId === integration.id;
  const isParent = account.id === integration.parentId;

  if (isChild && isParent) return Ok();

  if (!isChild) {
    console.log("Updating ToTAccount BeatLeader integration id");

    const isChildResult = await dbEditor.ToTAccount.update(account.id, {
      beatLeaderId: integration.id,
    });

    if (!isChildResult.ok) {
      return Err(Error("Can't update ToTAccount BeatLeader integration id"));
    }
  }

  if (!isParent) {
    console.log("Updating BeatLeaderIntegration parent id");

    const isParentResult = await dbEditor.BeatLeaderIntegration.update(integration.id, {
      parentId: account.id,
    });

    if (!isParentResult.ok) {
      return Err(Error("Can't update BeatLeaderIntegration parent id"));
    }
  }

  return Ok();
};

const ensureDiscordIntegrationLink = async (account: ToTAccountFlatSchemaT, integration: DiscordIntegrationSchemaT) => {
  const isChild = account.discordId === integration.id;
  const isParent = account.id === integration.parentId;

  if (isChild && isParent) return Ok();

  if (!isChild) {
    console.log("Updating ToTAccount discord integration id");

    const isChildResult = await dbEditor.ToTAccount.update(account.id, {
      discordId: integration.id,
    });

    if (!isChildResult.ok) {
      return Err(Error("Can't update ToTAccount discord integration id"));
    }
  }

  if (!isParent) {
    console.log("Updating DiscordIntegration parent id");

    const isParentResult = await dbEditor.DiscordIntegration.update(integration.id, {
      parentId: account.id,
    });

    if (!isParentResult.ok) {
      return Err(Error("Can't update DiscordIntegration parent id"));
    }
  }

  return Ok();
};

export const processBeatLeaderStatusForNewAccount = async (
  status: BeatLeaderCallbackStatus,
) => {
  if (!status.identity) return;

  const accountM = await ensureToTAccount(status.account, {
    beatLeaderId: status.identity.id,
    sessionIds: [status.sessionId],
  });
  if (accountM.isErr()) {
    throw accountM.unwrapErr();
  }
  const account = accountM.unwrap();

  const integrationM = await ensureBeatLeaderIntegration(status.integration, {
    id: status.identity.id,
    parentId: account.id,
    name: status.identity.name,
    accessToken: makeBeatLeaderUserAccessToken(status.tokens.accessToken),
    refreshToken: makeBeatLeaderUserRefreshToken(status.tokens.refreshToken!),
    expires: new Date(Date.now() + status.tokens.expiresIn!),
  });
  if (integrationM.isErr()) {
    throw integrationM.unwrapErr();
  }
  const integration = integrationM.unwrap();

  const linkingM = await ensureBeatLeaderIntegrationLink(account, integration);
  if (linkingM.isErr()) {
    throw linkingM.unwrapErr();
  }

  const accountSessionM = await registerToTAccountSession(status.sessionId, account, true);
  if (accountSessionM.isErr()) {
    throw accountSessionM.unwrapErr();
  }
};

export const processDiscordStatusForNewAccount = async (
  status: DiscordCallbackStatus,
) => {
  if (!status.identity) return;

  const accountM = await ensureToTAccount(status.account, {
    discordId: status.identity.id,
    sessionIds: [status.sessionId],
  });
  if (accountM.isErr()) {
    throw accountM.unwrapErr();
  }
  const account = accountM.unwrap();

  const integrationM = await ensureDiscordIntegration(status.integration, {
    id: status.identity.id,
    parentId: account.id,

    avatar: status.identity.avatar,
    global_name: status.identity.global_name,
    username: status.identity.username,

    accessToken: makeDiscordUserAccessToken(status.tokens.accessToken),
    refreshToken: makeDiscordUserRefreshToken(status.tokens.refreshToken!),
    expires: new Date(Date.now() + status.tokens.expiresIn!),
  });
  if (integrationM.isErr()) {
    throw integrationM.unwrapErr();
  }
  const integration = integrationM.unwrap();

  const linkingM = await ensureDiscordIntegrationLink(account, integration);
  if (linkingM.isErr()) {
    throw linkingM.unwrapErr();
  }

  const accountSessionM = await registerToTAccountSession(status.sessionId, account, true);
  if (accountSessionM.isErr()) {
    throw accountSessionM.unwrapErr();
  }
};

const integrityCheckForStatusAndExistingAccount = (
  parentProcessName: string,
  status: { account: ToTAccountFlatSchemaT | null },
  existingAccount: ToTAccountFlatSchemaT,
): void => {
  // status.account doesn't exist when it's a new integration for existing account
  // if (!status.account) throw Error(`(integrity) ${parentProcessName} no status.account`);
  if (status.account) {
    if (status.account.id !== existingAccount.id) {
      throw Error(`(integrity) ${parentProcessName} account id mismatch with existing account`);
    }
  }
};

export const processBeatLeaderStatusForExistingAccount = async (
  existingAccount: ToTAccountFlatSchemaT,
  status: BeatLeaderCallbackStatus,
) => {
  if (!status.identity) return;

  integrityCheckForStatusAndExistingAccount("processBeatLeaderStatusForExistingAccount", status, existingAccount);

  const accountSessionM = await registerToTAccountSession(status.sessionId, existingAccount);
  if (accountSessionM.isErr()) {
    throw accountSessionM.unwrapErr();
  }

  const integrationM = await ensureBeatLeaderIntegration(status.integration, {
    id: status.identity.id,
    parentId: existingAccount.id,
    name: status.identity.name,
    accessToken: makeBeatLeaderUserAccessToken(status.tokens.accessToken),
    refreshToken: makeBeatLeaderUserRefreshToken(status.tokens.refreshToken!),
    expires: new Date(Date.now() + status.tokens.expiresIn!),
  });
  if (integrationM.isErr()) {
    throw integrationM.unwrapErr();
  }
  const integration = integrationM.unwrap();

  const linkingM = await ensureBeatLeaderIntegrationLink(existingAccount, integration);
  if (linkingM.isErr()) {
    throw linkingM.unwrapErr();
  }
};

export const processDiscordStatusForExistingAccount = async (
  existingAccount: ToTAccountFlatSchemaT,
  status: DiscordCallbackStatus,
) => {
  if (!status.identity) return;

  integrityCheckForStatusAndExistingAccount("processDiscordStatusForExistingAccount", status, existingAccount);

  const accountSessionM = await registerToTAccountSession(status.sessionId, existingAccount);
  if (accountSessionM.isErr()) {
    throw accountSessionM.unwrapErr();
  }

  const integrationM = await ensureDiscordIntegration(status.integration, {
    id: status.identity.id,
    parentId: existingAccount.id,

    avatar: status.identity.avatar,
    global_name: status.identity.global_name,
    username: status.identity.username,

    accessToken: makeDiscordUserAccessToken(status.tokens.accessToken),
    refreshToken: makeDiscordUserRefreshToken(status.tokens.refreshToken!),
    expires: new Date(Date.now() + status.tokens.expiresIn!),
  });
  if (integrationM.isErr()) {
    throw integrationM.unwrapErr();
  }
  const integration = integrationM.unwrap();

  const linkingM = await ensureDiscordIntegrationLink(existingAccount, integration);
  if (linkingM.isErr()) {
    throw linkingM.unwrapErr();
  }
};

export const removeToTSession = async (sessionId: ToTAccountSessionId) => {
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
  id: ToTAccountSessionId,
  parentId: ToTAccountId,
  lastActiveAt = new Date(),
): ToTAccountSessionSchemaT => {
  return {
    id,
    parentId,
    lastActiveAt,
  };
};

export const registerToTAccountSession = async (
  id: ToTAccountSessionId,
  account: ToTAccountFlatSchemaT,
  skipToTAccountUpdate: boolean = false,
  lastActiveAt = new Date(),
): Promise<Result<ToTAccountSessionSchemaT, Error>> => {
  const performToTAccountUpdate = !skipToTAccountUpdate;
  if (performToTAccountUpdate) {
    await dbEditor.ToTAccount.update(account.id, {
      sessionIds: [...account.sessionIds, id],
    }, { strategy: "merge-shallow" });
  }
  const accountSession = createToTAccountSession(id, account.id, lastActiveAt);
  const result = await dbEditor.ToTAccountSession.add(accountSession);

  if (result.ok) {
    return Ok(accountSession);
  }

  return Err(Error("Failed to create a new ToTAccountSession"));
};

// const nukeAccountData = async () => {
//   await dbEditor.ToTAccount.deleteMany();
//   await dbEditor.ToTAccountSession.deleteMany();
//   await dbEditor.BeatLeaderIntegration.deleteMany();
//   await dbEditor.DiscordIntegration.deleteMany();
//   console.log("Nuke complete");
// };
// await nukeAccountData();
