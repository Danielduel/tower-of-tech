import { createUserAuthorizationHeaders, UserTokenSuccessSchemaT } from "@/packages/api-twitch/helix/common.ts";
import { TwitchHelixApiClient } from "./TwitchHelixApiClient.ts";
import { PatchHelixChannelsBodySchemaT } from "@/packages/api-twitch/helix/helixChannels.ts";
import { GetHelixUsersItemSchemaT } from "@/packages/api-twitch/helix/helixUsers.ts";
import { Err, Ok, Result } from "@/packages/utils/optionals.ts";
import { BroadcasterId, TwitchChannelPointsCustomRewardId } from "@/packages/api-twitch/helix/brand.ts";
import { HelixChannelsAdsItemSchemaT } from "@/packages/api-twitch/helix/helixChannelsAds.ts";
import { createTwitchEventSub } from "@/apps/twitch-bot/sockets/twitch-eventsub.ts";
import { HelixChannelsAdsScheduleSnoozeItemSchemaT } from "@/packages/api-twitch/helix/helixChannelsAdsScheduleSnooze.ts";
import {
  GetHelixChannelPointsCustomRewardsItemSchemaT,
  PatchHelixChannelPointsCustomRewardsBodySchemaT,
  PostHelixChannelPointsCustomRewardsBodySchemaT,
  PostHelixChannelPointsCustomRewardsItemSchemaT,
} from "@/packages/api-twitch/helix/helixChannelPointsCustomRewards.ts";
import { MINUTE_MS } from "@/packages/utils/time.ts";
import { HelixChatAnnouncementsBodySchemaT } from "@/packages/api-twitch/helix/helixChatAnnouncements.ts";
import { HelixEventSubSubscriptionsQuerySchemaT } from "@/packages/api-twitch/helix/helixEventSubSubscriptions.ts";

function unwrapDataArrayResponse<
  T extends { data: { data: (unknown)[] } | null } extends { data: { data: (infer P)[] } | null } ? P : unknown,
>(response: { data: { data: (T)[] } | null }): Result<T, Error> {
  const item = response.data?.data[0];

  if (!item) {
    return Err(Error("No data", { cause: response }));
  }

  return Ok(item);
}

function unwrapDataArrayResponseAll<
  T extends { data: { data: (unknown)[] } | null } extends { data: { data: (infer P)[] } | null } ? P : unknown,
>(response: { data: { data: (T)[] } | null }): Result<T[], Error> {
  const items = response.data?.data;

  if (!items) {
    return Err("No data");
  }

  return Ok(items);
}

function handlePatchResponse<T extends { ok: boolean; error?: Error }>(response: T): Result<null, Error> {
  if (response.ok) return Ok(null);
  return Err(response.error ?? "Other error");
}

export class ChatShoutoutItem {
  constructor(
    public targetBroadcasterId: BroadcasterId,
    public lastShoutoutTimestamp: number,
  ) {}
}

class ChatShoutoutManager {
  public lastChatShoutoutTimestamp = -1;
  public chatShoutoutCooldown = 2 * MINUTE_MS + 1;
  public chatShoutoutRecurringCooldown = 60 * MINUTE_MS + 1;
  public pastChatShoutouts: ChatShoutoutItem[] = [];
  public queuedChatShoutouts: BroadcasterId[] = [];
  public queuedChatShoutoutTimeout = -1;
}

export class TwitchHelixBroadcasterApi {
  public broadcasterLogin: string;
  protected broadcasterId: BroadcasterId;
  protected clientId: string;
  protected userCreds: UserTokenSuccessSchemaT;
  protected chatShoutoutManager = new ChatShoutoutManager();

  constructor(
    clientId: string,
    userCreds: UserTokenSuccessSchemaT,
    public userData: GetHelixUsersItemSchemaT,
  ) {
    this.clientId = clientId;
    this.userCreds = userCreds;
    this.broadcasterId = userData.id;
    this.broadcasterLogin = userData.login;
  }

  private static createAuthHeaders(
    clientId: string,
    userCreds: UserTokenSuccessSchemaT,
  ) {
    return createUserAuthorizationHeaders(clientId, userCreds.access_token);
  }

  private createAuthHeaders() {
    return TwitchHelixBroadcasterApi.createAuthHeaders(this.clientId, this.userCreds);
  }

  public static async getUser(
    clientId: string,
    userCreds: UserTokenSuccessSchemaT,
  ) {
    const response = await TwitchHelixApiClient.users.get({
      headers: this.createAuthHeaders(clientId, userCreds),
    });

    return unwrapDataArrayResponse(response);
  }

  public static async createFromUserCreds(
    clientId: string,
    userCreds: UserTokenSuccessSchemaT,
  ): Promise<Result<TwitchHelixBroadcasterApi, Error>> {
    const userDataResponseM = await TwitchHelixBroadcasterApi.getUser(
      clientId,
      userCreds,
    );
    const userData = userDataResponseM.unwrap();

    if (!userData) return Err("User data unavailable");

    return Ok(
      new TwitchHelixBroadcasterApi(
        clientId,
        userCreds,
        userData,
      ),
    );
  }

  public async setChannelInfo(body: PatchHelixChannelsBodySchemaT): Promise<Result<null, Error>> {
    const response = await TwitchHelixApiClient.channels.patch({
      headers: this.createAuthHeaders(),
      searchParams: {
        broadcaster_id: this.userData.id,
      },
      body,
    });

    return handlePatchResponse(response);
  }

  public async getChannelAds(): Promise<Result<HelixChannelsAdsItemSchemaT, Error>> {
    const response = await TwitchHelixApiClient.channelsAds.get({
      headers: this.createAuthHeaders(),
      searchParams: {
        broadcaster_id: this.broadcasterId,
      },
    });
    return unwrapDataArrayResponse(response);
  }

  public async postAdsSnooze(): Promise<Result<HelixChannelsAdsScheduleSnoozeItemSchemaT, Error>> {
    const response = await TwitchHelixApiClient.channelsAdsScheduleSnoozeResource.post({
      headers: this.createAuthHeaders(),
      searchParams: {
        broadcaster_id: this.broadcasterId,
      },
    });
    return unwrapDataArrayResponse(response);
  }

  public async createCustomPointReward(
    body: PostHelixChannelPointsCustomRewardsBodySchemaT,
  ): Promise<Result<PostHelixChannelPointsCustomRewardsItemSchemaT, Error>> {
    const response = await TwitchHelixApiClient.channelPointsCustomRewardsResource.post({
      headers: this.createAuthHeaders(),
      searchParams: {
        broadcaster_id: this.broadcasterId,
      },
      body,
    });
    return unwrapDataArrayResponse(response);
  }

  public async getCustomPointReward(
    id: TwitchChannelPointsCustomRewardId,
  ): Promise<Result<GetHelixChannelPointsCustomRewardsItemSchemaT, Error>> {
    const response = await TwitchHelixApiClient.channelPointsCustomRewardsResource.get({
      headers: this.createAuthHeaders(),
      searchParams: {
        broadcaster_id: this.broadcasterId,
        id,
      },
    });

    return unwrapDataArrayResponse(response);
  }

  public async postEventSubSubsctiption(body: HelixEventSubSubscriptionsQuerySchemaT): Promise<null> {
    const response = await TwitchHelixApiClient.eventSubSubsciptions.post({
      headers: this.createAuthHeaders(),
      body
    });
    console.log(response);
    return null;
  }
  
  public async updateCustomPointReward(
    id: TwitchChannelPointsCustomRewardId,
    update: PatchHelixChannelPointsCustomRewardsBodySchemaT,
  ): Promise<Result<GetHelixChannelPointsCustomRewardsItemSchemaT, Error>> {
    const response = await TwitchHelixApiClient.channelPointsCustomRewardsResource.patch({
      headers: this.createAuthHeaders(),
      searchParams: {
        broadcaster_id: this.broadcasterId,
        id,
      },
      body: update,
    });

    return unwrapDataArrayResponse(response);
  }

  public async getAllCustomPointRewards(): Promise<Result<GetHelixChannelPointsCustomRewardsItemSchemaT[], Error>> {
    const response = await TwitchHelixApiClient.channelPointsCustomRewardsResource.get({
      headers: this.createAuthHeaders(),
      searchParams: {
        broadcaster_id: this.broadcasterId,
      },
    });

    return unwrapDataArrayResponseAll(response);
  }

  public async getBroadcasterByName(broadcasterName: string) {
    const response = await TwitchHelixApiClient.searchChannels.get({
      headers: this.createAuthHeaders(),
      searchParams: {
        query: broadcasterName,
        first: 1,
      },
    });

    return unwrapDataArrayResponse(response);
  }

  public async getCurrentBroadcaster() {
    return await this.getBroadcasterByName(this.userData.login);
  }

  protected chatShoutoutLoop() {
    if (this.chatShoutoutManager.queuedChatShoutoutTimeout !== -1) return; // don't do anything if the queue is already working
    if (this.chatShoutoutManager.queuedChatShoutouts.length < 1) return; // don't do anything if there's anything in the queue
    const { lastChatShoutoutTimestamp, chatShoutoutCooldown } = this.chatShoutoutManager;
    const _nextChatShoutout = (lastChatShoutoutTimestamp + chatShoutoutCooldown) - Date.now();
    const nextChatShoutout = Math.max(_nextChatShoutout, 0);
    console.log("Next chat shoutout " + nextChatShoutout);
    this.chatShoutoutManager.queuedChatShoutoutTimeout = setTimeout(async () => {
      try {
        const { queuedChatShoutouts } = this.chatShoutoutManager;
        if (queuedChatShoutouts.length > 0) {
          // TODO(@Danielduel) - check and handle recurring shoutouts
          const broadcasterId = queuedChatShoutouts.shift()!;
          console.log(`Sending shoutout for ${broadcasterId}`);
          await TwitchHelixApiClient.chatShoutoutResource.post({
            headers: this.createAuthHeaders(),
            searchParams: {
              from_broadcaster_id: this.broadcasterId,
              to_broadcaster_id: broadcasterId,
              moderator_id: this.broadcasterId,
            },
          });
        }
      } catch (_) {
        /* Ignore the error for now, it will be caused by recurring shoutouts */
        console.error("FAILED TO SHOUTOUT");
        console.error(_);
      }
      this.chatShoutoutManager.lastChatShoutoutTimestamp = Date.now(); // even if the logic fails, I prefer to put the queue on cooldown
      this.chatShoutoutManager.queuedChatShoutoutTimeout = -1;
      this.chatShoutoutLoop();
    }, nextChatShoutout);
  }

  public postChatShoutout(targetBroadcasterId: BroadcasterId) {
    this.chatShoutoutManager.queuedChatShoutouts.push(targetBroadcasterId);
    this.chatShoutoutLoop();
  }

  public async postChatAnnouncement(body: HelixChatAnnouncementsBodySchemaT) {
    await TwitchHelixApiClient.chatAnnouncements.post({
      headers: this.createAuthHeaders(),
      searchParams: {
        broadcaster_id: this.broadcasterId,
        moderator_id: this.broadcasterId,
      },
      body,
    });
  }

  public async getEventSub() {
    return await createTwitchEventSub(this.broadcasterId, this.userCreds.access_token);
  }
}
