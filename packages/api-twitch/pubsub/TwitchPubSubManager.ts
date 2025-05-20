import { TwitchPubSubContext, TwitchPubSubEmitter, TwitchPubSubEvents } from "@/apps/twitch-bot/types.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { TwitchRedemptionRewardSchemaT } from "@/apps/twitch-bot/sockets/twitch-schema.ts";
import { TwitchChannelPointsCustomRewardId } from "@/packages/api-twitch/helix/brand.ts";
import { TwitchHelixBroadcasterApi } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApi.ts";

export class TwitchPubSubManager {
  #twitchPubSubEmitter: TwitchPubSubEmitter;
  #twitchPubSubContext: TwitchPubSubContext;
  #twitchHelixBroadcasterApi: TwitchHelixBroadcasterApi;
  #listensFor: string[] = [];

  #listensForRedeems = false;

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
    if (!this.#listensForRedeems) {
      this.#twitchHelixBroadcasterApi.postEventSubSubsctiption({
        condition: { broadcaster_user_id: this.#twitchHelixBroadcasterApi.userData.id },
        transport: { method: "websocket", session_id: this.#twitchPubSubContext.websocketSession.payload.session.id },
        type: "channel.channel_points_custom_reward_redemption.add",
        version: "1",
      });
      this.#listensForRedeems = true;
    }
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

      const shouldTrigger = event.reward.id === rewardId;

      if (shouldTrigger) return handler(...args);
    });
  }
}
