import { TwitchPubSubContext, TwitchPubSubEmitter, TwitchPubSubEvents } from "@/apps/twitch-bot/types.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { TwitchRedemptionRewardSchemaT } from "@/apps/twitch-bot/sockets/twitch-schema.ts";
import { TwitchChannelPointsCustomRewardId } from "@/packages/api-twitch/helix/brand.ts";
import { TwitchHelixBroadcasterApi } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApi.ts";

const _ = (type: string, apiVersion: number): { type: string; version: string } => ({
  type,
  version: `${apiVersion}`,
});
const channelSubscriptions = {
  channelUpdate: _("channel.update", 2),
  // channel:read:goals
  channelGoalBegin: _("channel.goal.begin", 1),
  // channel:read:goals
  channelGoalProgress: _("channel.goal.progress", 1),
  // bits:read
  channelCheer: _("channel.cheer", 1),
  // from_broadcaster_user_id or to_broadcaster_user_id is required in condition
  channelRaid: _("channel.raid", 1),
  // moderator:read:followers
  channelFollow: _("channel.follow", 2),
  // channel:read:redemptions
  // channel:manage:redemptions
  channelPointsCustomRewardRedemption: _("channel.channel_points_custom_reward_redemption.add", 1),
  // user:read:chat
  // addtionally user:bot for app access token
  channelChatMessage: _("channel.chat.message", 1),
};

export class TwitchPubSubManager {
  #twitchPubSubEmitter: TwitchPubSubEmitter;
  #twitchPubSubContext: TwitchPubSubContext;
  #twitchHelixBroadcasterApi: TwitchHelixBroadcasterApi;
  #listensFor: string[] = [];

  #listensForFollows = false;
  #listensForRedeems = false;
  #listensForRaids = false;
  #listensForGoalBegin = false;
  #listensForGoalProgress = false;

  constructor(
    twitchPubSubEmitter: TwitchPubSubEmitter,
    twitchPubSubContext: TwitchPubSubContext,
    twitchHelixBroadcasterApi: TwitchHelixBroadcasterApi,
  ) {
    this.#twitchPubSubEmitter = twitchPubSubEmitter;
    this.#twitchPubSubContext = twitchPubSubContext;
    this.#twitchHelixBroadcasterApi = twitchHelixBroadcasterApi;
  }

  private listenTopics(topics: string[]) {
    const transport = {
      method: "websocket" as const,
      session_id: this.#twitchPubSubContext.websocketSession.payload.session.id,
    };
    const condition = { broadcaster_user_id: this.#twitchHelixBroadcasterApi.userData.id };

    if (!this.#listensForFollows) {
      this.#twitchHelixBroadcasterApi.postEventSubSubscription({
        condition: {
          ...condition,
          moderator_user_id: condition.broadcaster_user_id
        },
        transport,
        ...channelSubscriptions.channelFollow,
      });
      this.#listensForFollows = true;
    }

    if (!this.#listensForRedeems) {
      this.#twitchHelixBroadcasterApi.postEventSubSubscription({
        condition,
        transport,
        ...channelSubscriptions.channelPointsCustomRewardRedemption,
      });
      this.#listensForRedeems = true;
    }

    if (!this.#listensForRaids) {
      this.#twitchHelixBroadcasterApi.postEventSubSubscription({
        condition: { to_broadcaster_user_id: this.#twitchHelixBroadcasterApi.userData.id },
        transport,
        ...channelSubscriptions.channelRaid,
      });
      this.#listensForRaids = true;
    }

    if (!this.#listensForGoalBegin) {
      this.#twitchHelixBroadcasterApi.postEventSubSubscription({
        condition,
        transport,
        ...channelSubscriptions.channelGoalBegin
      });
      this.#listensForGoalBegin = true;
    }

    if (!this.#listensForGoalProgress) {
      this.#twitchHelixBroadcasterApi.postEventSubSubscription({
        condition,
        transport,
        ...channelSubscriptions.channelGoalProgress
      });
      this.#listensForGoalProgress = true;
    }
  }

  private onChannelFollow(handler: (...args: TwitchPubSubEvents["channel_follow"]) => void) {
    this.#twitchPubSubEmitter.on("channel_follow", handler);
  }

  public registerChannelFollowCallback(
    handler: (...args: TwitchPubSubEvents["channel_follow"]) => void,
  ) {
    this.listenTopics([]);
    this.onChannelFollow((...args) => {
      return handler(...args);
    });
  }

  private onRewardRedeemed(handler: (...args: TwitchPubSubEvents["reward_redeemed"]) => void) {
    this.#twitchPubSubEmitter.on("reward_redeemed", handler);
  }

  public registerRewardRedeemedCallback(
    rewardId: TwitchChannelPointsCustomRewardId,
    handler: (...args: TwitchPubSubEvents["reward_redeemed"]) => void,
  ) {
    this.listenTopics(["channel-points-channel-v1"]);
    this.onRewardRedeemed((...args) => {
      const [event] = args;

      const shouldTrigger = event.event.reward.id === rewardId;

      if (shouldTrigger) return handler(...args);
    });
  }

  private onChannelRaid(handler: (...args: TwitchPubSubEvents["channel_raid"]) => void) {
    this.#twitchPubSubEmitter.on("channel_raid", handler);
  }

  public registerChannelRaidCallback(
    handler: (...args: TwitchPubSubEvents["channel_raid"]) => void,
  ) {
    this.listenTopics([]);
    this.onChannelRaid((...args) => {
      return handler(...args);
    });
  }
}
