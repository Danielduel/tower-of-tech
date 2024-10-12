import { TwitchPubSubContext, TwitchPubSubEmitter, TwitchPubSubEvents } from "@/apps/twitch-bot/types.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { TwitchRedemptionRewardSchemaT } from "@/apps/twitch-bot/sockets/twitch-schema.ts";
import { TwitchChannelPointsCustomRewardId } from "@/packages/api-twitch/helix/brand.ts";

export class TwitchPubSubManager {
  #twitchPubSubEmitter: TwitchPubSubEmitter;
  #twitchPubSubContext: TwitchPubSubContext;
  #listensFor: string[] = [];

  constructor(
    twitchPubSubEmitter: TwitchPubSubEmitter,
    twitchPubSubContext: TwitchPubSubContext,
  ) {
    this.#twitchPubSubEmitter = twitchPubSubEmitter;
    this.#twitchPubSubContext = twitchPubSubContext;
  }

  private listenTopics(topics: string[]) {
    const topicsToListen = topics
      .map((topic) => {
        if (this.#listensFor.includes(topic)) return null;
        this.#listensFor.push(topic);
        return topic;
      })
      .filter(filterNulls);
    this.#twitchPubSubContext.listenTopics(topicsToListen);
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
