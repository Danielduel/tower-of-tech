import {
  BeatLeaderAuthorizationSchemaT,
  BeatLeaderIntegrationSchemaT,
  DiscordAuthorizationSchemaT,
  DiscordIntegrationSchemaT,
  makeToTAccountId,
  ToTAccountFlatSchemaT,
  ToTAccountId,
  ToTAccountSchemaT,
  ToTAccountSessionId,
  ToTAccountSessionSchemaT,
  TwitchAuthorizationSchemaT,
  TwitchIntegrationSchemaT,
} from "@/packages/types/auth.ts";
import { DB } from "@/packages/db/mod.ts";
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
import { makeUserAccessToken, UserAccessToken } from "@/packages/api-twitch/helix/brand.ts";
import { createUserAuthorizationHeaders } from "@/packages/api-twitch/helix/common.ts";
import { getTwitchSessionId } from "@/packages/api/v1/auth/twitch-config.ts";
import { TwitchHelixApiClient } from "@/packages/api-twitch/helix/TwitchHelixApiClient.ts";
import { GetHelixUsersItemSchemaT } from "@/packages/api-twitch/helix/helixUsers.ts";
import { makeUserRefreshToken } from "@/packages/api-twitch/helix/brand.ts";

const TWITCH_API_CLIENT_ID = Deno.env.get("TWITCH_API_CLIENT_ID")!;

const getSessionFromSessionId = async (sessionId: ToTAccountSessionId) => {
  const db = await DB.get();
  return await db.ToTAccountSession.find(sessionId);
};

const getAccountFromAccountId = async (accountId: ToTAccountId) => {
  const db = await DB.get();
  return await db.ToTAccount.find(accountId);
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
      await getTwitchSessionId(request) as ToTAccountSessionId | undefined,
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

export const getFullAccountFromRequestM = async (
  request: Request,
): Promise<Result<ToTAccountSchemaT, Error>> => {
  const accountM = await getAccountFromRequestM(request);
  if (accountM.isErr()) {
    return Err(accountM.unwrapErr());
  }
  const account = accountM.unwrap();
  
  const db = await DB.get();

  const sessions = (await Array.fromAsync(_getSessionFromSessionIds(account.sessionIds))).filter(filterUndefineds);
  const beatLeaderR = account.beatLeaderId ? await db.BeatLeaderIntegration.find(account.beatLeaderId) : null;
  const beatLeader = beatLeaderR ? beatLeaderR.value : null;

  const discordR = account.discordId ? await db.DiscordIntegration.find(account.discordId) : null;
  const discord = discordR ? discordR.value : null;

  const twitchR = account.twitchId ? await db.TwitchIntegration.find(account.twitchId) : null;
  const twitch = twitchR ? twitchR.value : null;

  return Ok({
    ...account,
    sessions,
    beatLeader,
    discord,
    twitch,
  });
};

type AllTokens = {
  beatLeader?: Tokens;
  discord?: Tokens;
  twitch?: Tokens;
};

type BeatLeaderCallbackStatus = {
  account: ToTAccountFlatSchemaT | null;
  authorization: BeatLeaderAuthorizationSchemaT | null;
  integration: BeatLeaderIntegrationSchemaT | null;
  identity: BeatLeaderApiOauthIdentityBodySchemaT | null;
  tokens: Tokens;
  sessionId: ToTAccountSessionId;
};

type DiscordCallbackStatus = {
  account: ToTAccountFlatSchemaT | null;
  authorization: DiscordAuthorizationSchemaT | null;
  integration: DiscordIntegrationSchemaT | null;
  identity: DiscordApiUsersMeBodySchemaT | null;
  tokens: Tokens;
  sessionId: ToTAccountSessionId;
};

type TwitchCallbackStatus = {
  account: ToTAccountFlatSchemaT | null;
  authorization: TwitchAuthorizationSchemaT | null;
  integration: TwitchIntegrationSchemaT | null;
  identity: GetHelixUsersItemSchemaT | null;
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

const getTwitchIdentityM = async (
  token: UserAccessToken,
): Promise<Result<GetHelixUsersItemSchemaT, Error>> => {
  const data = await TwitchHelixApiClient.users.get({
    headers: createUserAuthorizationHeaders(TWITCH_API_CLIENT_ID, token),
  });

  if (data.ok) {
    return Ok(data.data.data[0]);
  }

  return Err(Error("Failed to get twitch identity"));
};

const getAccountFromBeatLeaderConnectedAccount = async (
  beatLeaderIdentity: BeatLeaderApiOauthIdentityBodySchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const db = await DB.get();

  const beatLeaderConnectedAccounts = await db.ToTAccount.findBySecondaryIndex(
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
  const db = await DB.get();

  const discordConnectedAccounts = await db.ToTAccount.findBySecondaryIndex(
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

const getAccountFromTwitchConnectedAccount = async (
  twitchIdentity: GetHelixUsersItemSchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const db = await DB.get();

  const twitchConnectedAccounts = await db.ToTAccount.findBySecondaryIndex(
    "twitchId",
    twitchIdentity.id,
  );
  const twitchConnectedAccountFound = twitchConnectedAccounts.result.length > 0;
  if (twitchConnectedAccountFound) {
    const [connectedAccount] = twitchConnectedAccounts.result;
    return Ok(connectedAccount.value);
  }
  return Err(Error("Can't find twitch connected account"));
};

const getBeatLeaderIntegrationFromBeatLeaderIdentityM = async (
  beatLeaderIdentity: BeatLeaderApiOauthIdentityBodySchemaT,
): Promise<Result<BeatLeaderIntegrationSchemaT, Error>> => {
  const db = await DB.get();

  const beatLeaderIntegration = await db.BeatLeaderIntegration.find(beatLeaderIdentity.id);
  if (beatLeaderIntegration) {
    return Ok(beatLeaderIntegration.value);
  }
  return Err(Error("Can't find beatleader integration"));
};

const getDiscordIntegrationFromDiscordIdentityM = async (
  discordIdentity: DiscordApiUsersMeBodySchemaT,
): Promise<Result<DiscordIntegrationSchemaT, Error>> => {
  const db = await DB.get();

  const discordIntegration = await db.DiscordIntegration.find(discordIdentity.id);
  if (discordIntegration) {
    return Ok(discordIntegration.value);
  }
  return Err(Error("Can't find discord integration"));
};

const getTwitchIntegrationFromTwitchIdentityM = async (
  twitchIdentity: GetHelixUsersItemSchemaT,
): Promise<Result<TwitchIntegrationSchemaT, Error>> => {
  const db = await DB.get();

  const twitchIntegration = await db.TwitchIntegration.find(twitchIdentity.id);
  if (twitchIntegration) {
    return Ok(twitchIntegration.value);
  }
  return Err(Error("Can't find twitch integration"));
};

const getAccountFromBeatLeaderIntegrationM = async (
  beatLeaderIntegration: BeatLeaderIntegrationSchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const db = await DB.get();

  const account = await db.ToTAccount.find(beatLeaderIntegration.parentId);
  if (account) {
    return Ok(account.value);
  }
  return Err(Error("Can't find the account from beatleader integration"));
};

const getBeatLeaderAuthorizationFromBeatLeaderIdentityM = async (
  identity: BeatLeaderApiOauthIdentityBodySchemaT,
): Promise<Result<BeatLeaderAuthorizationSchemaT, Error>> => {
  const db = await DB.get();

  const account = await db.BeatLeaderAuthorization.find(identity.id);
  if (account) {
    return Ok(account.value);
  }
  return Err(Error("Can't find the beatleader authorization from beatleader identity"));
};

const getDiscordAuthorizationFromDiscordIdentityM = async (
  identity: DiscordApiUsersMeBodySchemaT,
): Promise<Result<DiscordAuthorizationSchemaT, Error>> => {
  const db = await DB.get();

  const account = await db.DiscordAuthorization.find(identity.id);
  if (account) {
    return Ok(account.value);
  }
  return Err(Error("Can't find the discord authorization from discord identity"));
};

const getTwitchAuthorizationFromTwitchIdentityM = async (
  identity: GetHelixUsersItemSchemaT,
): Promise<Result<TwitchAuthorizationSchemaT, Error>> => {
  const db = await DB.get();

  const account = await db.TwitchAuthorization.find(identity.id);
  if (account) {
    return Ok(account.value);
  }
  return Err(Error("Can't find the twitch authorization from twitch identity"));
};

const getAccountFromDiscordIntegrationM = async (
  discordIntegration: DiscordIntegrationSchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const db = await DB.get();

  const account = await db.ToTAccount.find(discordIntegration.parentId);
  if (account) {
    return Ok(account.value);
  }
  return Err(Error("Can't find the account from discord integration"));
};

const getAccountFromTwitchIntegrationM = async (
  twitchIntegration: TwitchIntegrationSchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const db = await DB.get();

  const account = await db.ToTAccount.find(twitchIntegration.parentId);
  if (account) {
    return Ok(account.value);
  }
  return Err(Error("Can't find the account from twitch integration"));
};

const getAccountFromBeatLeaderIdentityM = async (
  beatLeaderIdentity: BeatLeaderApiOauthIdentityBodySchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const beatLeaderIntegrationM = await getBeatLeaderIntegrationFromBeatLeaderIdentityM(beatLeaderIdentity);
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
  const discordIntegrationM = await getDiscordIntegrationFromDiscordIdentityM(discordIdentity);
  if (discordIntegrationM.isOk()) {
    const discordIntegration = discordIntegrationM.unwrap();
    const accountM = await getAccountFromDiscordIntegrationM(discordIntegration);
    if (accountM.isOk()) {
      return accountM;
    }
  }
  return Err(Error("Can't find account from discord integration"));
};

const getAccountFromTwitchIdentityM = async (
  twitchIdentity: GetHelixUsersItemSchemaT,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const twitchIntegrationM = await getTwitchIntegrationFromTwitchIdentityM(twitchIdentity);
  if (twitchIntegrationM.isOk()) {
    const twitchIntegration = twitchIntegrationM.unwrap();
    const accountM = await getAccountFromTwitchIntegrationM(twitchIntegration);
    if (accountM.isOk()) {
      return accountM;
    }
  }
  return Err(Error("Can't find account from twitch integration"));
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

const getAccountFromTwitchTokensM = async (tokens: Tokens): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const twitchIdentityM = await getTwitchIdentityM(makeUserAccessToken(tokens.accessToken));
  if (twitchIdentityM.isErr()) {
    return Err(Error("Can't fetch twitch identity using this access token"));
  }
  const twitchIdentity = twitchIdentityM.unwrap();

  const connectedAccountM = await getAccountFromTwitchConnectedAccount(twitchIdentity);
  if (connectedAccountM.isOk()) {
    return Ok(connectedAccountM.unwrap());
  }

  const integrationAccountM = await getAccountFromTwitchIdentityM(twitchIdentity);
  if (integrationAccountM.isOk()) {
    return Ok(integrationAccountM.unwrap());
  }

  return Err(Error("Can't find account from twitch tokens"));
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

  if (tokens.twitch) {
    const accountM = await getAccountFromTwitchTokensM(tokens.twitch);
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
      authorization: null,
      integration: null,
      tokens,
      sessionId,
    };
  }
  const identity = identityM.unwrap();

  const integrationM = await getBeatLeaderIntegrationFromBeatLeaderIdentityM(identity);
  const integration = integrationM.isOk() ? integrationM.unwrap() : null;
  const authorizationM = await getBeatLeaderAuthorizationFromBeatLeaderIdentityM(identity);
  const authorization = authorizationM.isOk() ? authorizationM.unwrap() : null;

  if (!integration) {
    const accountM = await getAccountFromBeatLeaderConnectedAccount(identity);
    const account = accountM.isOk() ? accountM.unwrap() : null;
    return {
      identity,
      account,
      authorization,
      integration,
      tokens,
      sessionId,
    };
  }

  const accountM = await getAccountFromBeatLeaderIntegrationM(integration);
  if (accountM.isErr()) {
    return {
      identity,
      integration,
      authorization: null,
      account: null,
      tokens,
      sessionId,
    };
  }
  const account = accountM.unwrap();

  return {
    identity,
    account,
    authorization,
    integration,
    tokens,
    sessionId,
  };
};

export const getTwitchCallbackStatusFromTwitchTokens = async (
  tokens: Tokens,
  sessionId: ToTAccountSessionId,
): Promise<TwitchCallbackStatus> => {
  const identityM = await getTwitchIdentityM(makeUserAccessToken(tokens.accessToken));
  if (identityM.isErr()) {
    return {
      identity: null,
      account: null,
      authorization: null,
      integration: null,
      tokens,
      sessionId,
    };
  }
  const identity = identityM.unwrap();

  const integrationM = await getTwitchIntegrationFromTwitchIdentityM(identity);
  const integration = integrationM.isOk() ? integrationM.unwrap() : null;
  const authorizationM = await getTwitchAuthorizationFromTwitchIdentityM(identity);
  const authorization = authorizationM.isOk() ? authorizationM.unwrap() : null;

  if (!integration) {
    const accountM = await getAccountFromTwitchConnectedAccount(identity);
    const account = accountM.isOk() ? accountM.unwrap() : null;
    return {
      identity,
      account,
      authorization,
      integration,
      tokens,
      sessionId,
    };
  }

  const accountM = await getAccountFromTwitchIntegrationM(integration);
  const account = accountM.isOk() ? accountM.unwrap() : null;

  return {
    identity,
    account,
    authorization,
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
      authorization: null,
      integration: null,
      tokens,
      sessionId,
    };
  }
  const identity = identityM.unwrap();

  const integrationM = await getDiscordIntegrationFromDiscordIdentityM(identity);
  const integration = integrationM.isOk() ? integrationM.unwrap() : null;
  const authorizationM = await getDiscordAuthorizationFromDiscordIdentityM(identity);
  const authorization = authorizationM.isOk() ? authorizationM.unwrap() : null;

  if (!integration) {
    const accountM = await getAccountFromDiscordConnectedAccount(identity);
    const account = accountM.isOk() ? accountM.unwrap() : null;
    return {
      identity,
      account,
      authorization,
      integration,
      tokens,
      sessionId,
    };
  }

  const accountM = await getAccountFromDiscordIntegrationM(integration);
  const account = accountM.isOk() ? accountM.unwrap() : null;

  return {
    identity,
    account,
    authorization,
    integration,
    tokens,
    sessionId,
  };
};

const ensureToTAccount = async (
  account: ToTAccountFlatSchemaT | null,
  defaults: Partial<ToTAccountFlatSchemaT>,
): Promise<Result<ToTAccountFlatSchemaT, Error>> => {
  const db = await DB.get();

  if (account) return Ok(account);

  console.log("Creating new ToTAccount");
  const id = defaults.id ?? makeToTAccountId(ulid());
  const version = defaults.version ?? 0;
  const beatLeaderId = defaults.beatLeaderId ?? null;
  const sessionIds = defaults.sessionIds ?? [];
  const discordId = defaults.discordId ?? null;
  const twitchId = defaults.twitchId ?? null;

  const newAccount = {
    id,
    version,
    beatLeaderId,
    discordId,
    sessionIds,
    twitchId,
  } satisfies ToTAccountFlatSchemaT;

  const resolve = await db.ToTAccount.add(newAccount);

  if (resolve.ok) {
    return Ok(newAccount);
  }

  return Err(Error("Failed to create a new ToTAccount"));
};

type KvDexSchemaItemAddValue<K extends keyof typeof DB.schema> = Parameters<
  ReturnType<typeof DB.schema[K]>["add"]
>["0"];
const createEnsureDatabaseItem = <K extends keyof typeof DB.schema>(
  databaseKey: K,
) =>
async <T extends KvDexSchemaItemAddValue<K>>(
  item: T | null,
  defaults: T,
): Promise<Result<T, Error>> => {
  if (item) return Ok(item);

  console.log(`Creating new ${databaseKey}`);
  const db = await DB.get();

  const resolve = await db[databaseKey].add(defaults as any); // TODO(@Danielduel) unhack this

  if (resolve.ok) {
    return Ok(defaults);
  }

  return Err(Error(`Failed to create a new ${databaseKey}`));
};
export const ensureBeatLeaderIntegration = createEnsureDatabaseItem("BeatLeaderIntegration");
export const ensureBeatLeaderAuthorization = createEnsureDatabaseItem("BeatLeaderAuthorization");
export const ensureDiscordIntegration = createEnsureDatabaseItem("DiscordIntegration");
export const ensureDiscordAuthorization = createEnsureDatabaseItem("DiscordAuthorization");
export const ensureTwitchIntegration = createEnsureDatabaseItem("TwitchIntegration");
export const ensureTwitchAuthorization = createEnsureDatabaseItem("TwitchAuthorization");

/**
 *         itemA        ┌─────────┐    itemB
 *                      │         ▼
 *  id (atobKey) (A) ◄──┼────┐   id (btoaKey) (B)
 *                      │    │
 *                      ▼    │
 *  childId (atobLink) (C)   └─► childId (btoaLink) (D)
 */

type KvDexSchemaItemUpdateValue<K extends keyof typeof DB.schema> = Parameters<
  ReturnType<typeof DB.schema[K]>["update"]
>["1"];
const createEnsureLink = <
  K1 extends keyof typeof DB.schema,
  K2 extends keyof typeof DB.schema,
  I1 extends KvDexSchemaItemUpdateValue<K1>,
  I2 extends KvDexSchemaItemUpdateValue<K2>,
  A extends keyof I1,
  B extends keyof I2,
  C extends keyof I1,
  D extends keyof I2,
>(
  databaseKeyItemA: K1,
  databaseKeyItemB: K2,
  atobKey: A,
  btoaKey: B,
  atobLink: C,
  btoaLink: D,
) =>
async <
  ItemA extends I1,
  ItemB extends I2,
>(
  itemA: ItemA,
  itemB: ItemB,
): Promise<Result<void, Error>> => {
  const idA = itemA[atobKey];
  const childA = itemA[atobLink];
  const idB = itemB[btoaKey];
  const childB = itemB[btoaLink];

  // @ts-ignore I don't care, it's fine. I spent an hour trying to metaprogram this link, but I surrender.
  const isALinked = idA === childB;

  // @ts-ignore I don't care, it's fine. I spent an hour trying to metaprogram this link, but I surrender.
  const isBLinked = idB === childA;

  if (!isALinked || !isBLinked) {
    console.log(`
      Check failed, updating.
      isALinked=${isALinked} (From ${databaseKeyItemB}(B) to ${databaseKeyItemA}(A))
      itemA.${atobKey as string} === itemB.${btoaLink as string}
      itemA.${atobKey as string} is ${itemA[atobKey]}
      itemB.${btoaLink as string} is ${itemB[btoaLink]}
      
      isBLinked=${isBLinked} (From ${databaseKeyItemA}(A) to ${databaseKeyItemB}(B))
      itemB.${btoaKey as string} === itemA.${atobLink as string}
      itemB.${btoaKey as string} is ${itemB[btoaKey]}
      itemA.${atobLink as string} is ${itemA[atobLink]}
`);
  }

  if (!isALinked) {
    console.log(`Update ${databaseKeyItemB}.${btoaLink as string} = ${idA}`);
    // @ts-ignore I don't care, it's fine. I spent an hour trying to metaprogram this link, but I surrender.
    const result = await dbEditor[databaseKeyItemB].update(idB, {
      [btoaLink]: idA,
    });
    if (!result.ok) {
      // @ts-ignore I don't care, it's fine. I spent an hour trying to metaprogram this link, but I surrender.
      return Err(Error(`Can't update ${databaseKeyItemB}.${btoaLink as string} = ${idA} for ${idB}`));
    }
  }

  if (!isBLinked) {
    console.log(`Update ${databaseKeyItemA}.${atobLink as string} = ${idB}`);
    // @ts-ignore I don't care, it's fine. I spent an hour trying to metaprogram this link, but I surrender.
    const result = await dbEditor[databaseKeyItemA].update(idA, {
      [atobLink]: idB,
    });
    if (!result.ok) {
      // @ts-ignore I don't care, it's fine. I spent an hour trying to metaprogram this link, but I surrender.
      return Err(Error(`Can't update ${databaseKeyItemA}.${atobLink as string} = ${idB} for ${idA}`));
    }
  }

  return Ok();
};

const ensureDiscordIntegrationLink = createEnsureLink(
  "ToTAccount",
  "DiscordIntegration",
  "id",
  "id",
  "discordId",
  "parentId",
);

const ensureDiscordAuthorizationLink = createEnsureLink(
  "ToTAccount",
  "DiscordAuthorization",
  "id",
  "id",
  "discordId",
  "parentId",
);

const ensureBeatLeaderIntegrationLink = createEnsureLink(
  "ToTAccount",
  "BeatLeaderIntegration",
  "id",
  "id",
  "beatLeaderId",
  "parentId",
);

const ensureBeatLeaderAuthorizationLink = createEnsureLink(
  "ToTAccount",
  "BeatLeaderAuthorization",
  "id",
  "id",
  "beatLeaderId",
  "parentId",
);

const ensureTwitchIntegrationLink = createEnsureLink(
  "ToTAccount",
  "TwitchIntegration",
  "id",
  "id",
  "twitchId",
  "parentId",
);

const ensureTwitchAuthorizationLink = createEnsureLink(
  "ToTAccount",
  "TwitchAuthorization",
  "id",
  "id",
  "twitchId",
  "parentId",
);

export const processTwitchStatusForNewAccount = async (
  status: TwitchCallbackStatus,
) => {
  if (!status.identity) return;

  const accountM = await ensureToTAccount(status.account, {
    twitchId: status.identity.id,
    sessionIds: [status.sessionId],
  });
  if (accountM.isErr()) {
    throw accountM.unwrapErr();
  }
  const account = accountM.unwrap();

  const integrationM = await ensureTwitchIntegration(status.integration, {
    id: status.identity.id,
    parentId: account.id,
    displayName: status.identity.display_name,
    login: status.identity.login,
  });
  if (integrationM.isErr()) {
    throw integrationM.unwrapErr();
  }
  const integration = integrationM.unwrap();

  const authorizationM = await ensureTwitchAuthorization(status.authorization, {
    id: status.identity.id,
    parentId: account.id,

    accessToken: makeUserAccessToken(status.tokens.accessToken),
    refreshToken: makeUserRefreshToken(status.tokens.refreshToken!),
    expires: new Date(Date.now() + status.tokens.expiresIn!),
  });
  if (authorizationM.isErr()) {
    throw authorizationM.unwrapErr();
  }
  const authorization = authorizationM.unwrap();

  const integrationLinkingM = await ensureTwitchIntegrationLink(account, integration);
  if (integrationLinkingM.isErr()) {
    throw integrationLinkingM.unwrapErr();
  }

  const authorizationLinkingM = await ensureTwitchAuthorizationLink(account, authorization);
  if (authorizationLinkingM.isErr()) {
    throw authorizationLinkingM.unwrapErr();
  }

  const accountSessionM = await registerToTAccountSession(status.sessionId, account, true);
  if (accountSessionM.isErr()) {
    throw accountSessionM.unwrapErr();
  }
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
  });
  if (integrationM.isErr()) {
    throw integrationM.unwrapErr();
  }
  const integration = integrationM.unwrap();

  const authorizationM = await ensureBeatLeaderAuthorization(status.authorization, {
    id: status.identity.id,
    parentId: account.id,

    accessToken: makeBeatLeaderUserAccessToken(status.tokens.accessToken),
    refreshToken: makeBeatLeaderUserRefreshToken(status.tokens.refreshToken!),
    expires: new Date(Date.now() + status.tokens.expiresIn!),
  });
  if (authorizationM.isErr()) {
    throw authorizationM.unwrapErr();
  }
  const authorization = authorizationM.unwrap();

  const integrationLinkingM = await ensureBeatLeaderIntegrationLink(account, integration);
  if (integrationLinkingM.isErr()) {
    throw integrationLinkingM.unwrapErr();
  }

  const authorizationLinkingM = await ensureBeatLeaderAuthorizationLink(account, authorization);
  if (authorizationLinkingM.isErr()) {
    throw authorizationLinkingM.unwrapErr();
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
  });
  if (integrationM.isErr()) {
    throw integrationM.unwrapErr();
  }
  const integration = integrationM.unwrap();

  const authorizationM = await ensureDiscordAuthorization(status.authorization, {
    id: status.identity.id,
    parentId: account.id,

    accessToken: makeDiscordUserAccessToken(status.tokens.accessToken),
    refreshToken: makeDiscordUserRefreshToken(status.tokens.refreshToken!),
    expires: new Date(Date.now() + status.tokens.expiresIn!),
  });
  if (authorizationM.isErr()) {
    throw authorizationM.unwrapErr();
  }
  const authorization = authorizationM.unwrap();

  const integrationLinkingM = await ensureDiscordIntegrationLink(account, integration);
  if (integrationLinkingM.isErr()) {
    throw integrationLinkingM.unwrapErr();
  }

  const authorizationLinkingM = await ensureDiscordAuthorizationLink(account, authorization);
  if (authorizationLinkingM.isErr()) {
    throw authorizationLinkingM.unwrapErr();
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

export const processTwitchStatusForExistingAccount = async (
  existingAccount: ToTAccountFlatSchemaT,
  status: TwitchCallbackStatus,
) => {
  if (!status.identity) return;

  integrityCheckForStatusAndExistingAccount("processTwitchStatusForExistingAccount", status, existingAccount);

  const accountSessionM = await registerToTAccountSession(status.sessionId, existingAccount);
  if (accountSessionM.isErr()) {
    throw accountSessionM.unwrapErr();
  }

  const integrationM = await ensureTwitchIntegration(status.integration, {
    id: status.identity.id,
    parentId: existingAccount.id,
    displayName: status.identity.display_name,
    login: status.identity.login,
  });
  if (integrationM.isErr()) {
    throw integrationM.unwrapErr();
  }
  const integration = integrationM.unwrap();

  const authorizationM = await ensureTwitchAuthorization(status.authorization, {
    id: status.identity.id,
    parentId: existingAccount.id,

    accessToken: makeUserAccessToken(status.tokens.accessToken),
    refreshToken: makeUserRefreshToken(status.tokens.refreshToken!),
    expires: new Date(Date.now() + status.tokens.expiresIn!),
  });
  if (authorizationM.isErr()) {
    throw authorizationM.unwrapErr();
  }
  const authorization = authorizationM.unwrap();

  const integrationLinkingM = await ensureTwitchIntegrationLink(existingAccount, integration);
  if (integrationLinkingM.isErr()) {
    throw integrationLinkingM.unwrapErr();
  }

  const authorizationLinkingM = await ensureTwitchAuthorizationLink(existingAccount, authorization);
  if (authorizationLinkingM.isErr()) {
    throw authorizationLinkingM.unwrapErr();
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
  });
  if (integrationM.isErr()) {
    throw integrationM.unwrapErr();
  }
  const integration = integrationM.unwrap();

  const authorizationM = await ensureBeatLeaderAuthorization(status.authorization, {
    id: status.identity.id,
    parentId: existingAccount.id,

    accessToken: makeBeatLeaderUserAccessToken(status.tokens.accessToken),
    refreshToken: makeBeatLeaderUserRefreshToken(status.tokens.refreshToken!),
    expires: new Date(Date.now() + status.tokens.expiresIn!),
  });
  if (authorizationM.isErr()) {
    throw authorizationM.unwrapErr();
  }
  const authorization = authorizationM.unwrap();

  const integrationLinkingM = await ensureBeatLeaderIntegrationLink(existingAccount, integration);
  if (integrationLinkingM.isErr()) {
    throw integrationLinkingM.unwrapErr();
  }

  const authorizationLinkingM = await ensureBeatLeaderAuthorizationLink(existingAccount, authorization);
  if (authorizationLinkingM.isErr()) {
    throw authorizationLinkingM.unwrapErr();
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
  });
  if (integrationM.isErr()) {
    throw integrationM.unwrapErr();
  }
  const integration = integrationM.unwrap();

  const authorizationM = await ensureDiscordAuthorization(status.authorization, {
    id: status.identity.id,
    parentId: existingAccount.id,

    accessToken: makeDiscordUserAccessToken(status.tokens.accessToken),
    refreshToken: makeDiscordUserRefreshToken(status.tokens.refreshToken!),
    expires: new Date(Date.now() + status.tokens.expiresIn!),
  });
  if (authorizationM.isErr()) {
    throw authorizationM.unwrapErr();
  }
  const authorization = authorizationM.unwrap();

  const integrationLinkingM = await ensureDiscordIntegrationLink(existingAccount, integration);
  if (integrationLinkingM.isErr()) {
    throw integrationLinkingM.unwrapErr();
  }

  const authorizationLinkingM = await ensureDiscordAuthorizationLink(existingAccount, authorization);
  if (authorizationLinkingM.isErr()) {
    throw authorizationLinkingM.unwrapErr();
  }
};

export const removeToTSession = async (sessionId: ToTAccountSessionId) => {
  console.log(`Removing session ${sessionId}`);
  const db = await DB.get();

  const session = await getSessionFromSessionId(sessionId);
  if (session) {
    const account = await getAccountFromAccountId(session.value.parentId);
    if (account) {
      await db.ToTAccount.update(account.id, {
        sessionIds: account.value.sessionIds.filter((x) => x !== sessionId),
      }, { strategy: "merge-shallow" });
    }
    await db.ToTAccountSession.delete(session.id);
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
  const db = await DB.get();

  const performToTAccountUpdate = !skipToTAccountUpdate;
  if (performToTAccountUpdate) {
    await db.ToTAccount.update(account.id, {
      sessionIds: [...account.sessionIds, id],
    }, { strategy: "merge-shallow" });
  }
  const accountSession = createToTAccountSession(id, account.id, lastActiveAt);
  const result = await db.ToTAccountSession.add(accountSession);

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
//   await dbEditor.TwitchIntegration.deleteMany();
//   await dbEditor.BeatLeaderAuthorization.deleteMany();
//   await dbEditor.DiscordAuthorization.deleteMany();
//   await dbEditor.TwitchAuthorization.deleteMany();
//   console.log("Nuke complete");
// };
// await nukeAccountData();
