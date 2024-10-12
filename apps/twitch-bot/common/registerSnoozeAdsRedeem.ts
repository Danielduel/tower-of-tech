import { TwitchPubSubManager } from "@/packages/api-twitch/pubsub/TwitchPubSubManager.ts";
import { TwitchIRCEventContext } from "@/apps/twitch-bot/types.ts";
import { TwitchHelixBroadcasterApiManaged } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApiManaged.ts";
import { MINUTE_MS } from "@/packages/utils/time.ts";
import { getTimeAgo } from "@/packages/discord/cron/tech-multi/utils.ts";

export const registerSnoozeAdsRedeem = async (
  twitchPubSubManager: TwitchPubSubManager,
  ircContext: TwitchIRCEventContext,
  twitchHelixBroadcasterApiManaged: TwitchHelixBroadcasterApiManaged,
) => {
  const snoozeAdsRedeemM = await twitchHelixBroadcasterApiManaged.getOrCreateCustomPointReward("snoozeAdsRedeem", {
    title: "Snooze/Check ads (or fail)",
    cost: 555,
    global_cooldown_seconds: 60,
    is_global_cooldown_enabled: true,
  });

  if (snoozeAdsRedeemM.isErr()) {
    console.error(snoozeAdsRedeemM.unwrapErr());
    return;
  }
  const snoozeAdsRedeem = snoozeAdsRedeemM.unwrap();

  twitchPubSubManager.registerRewardRedeemedCallback(snoozeAdsRedeem.id, async ({ redemption }) => {
    const nextAdsM = await twitchHelixBroadcasterApiManaged.getChannelAds();
    if (nextAdsM.isErr()) {
      ircContext.send(`@${redemption.user.display_name} there was an error, thanks for points CODE 115`);
      return;
    }
    const nextAds = nextAdsM.unwrap();
    const nextAdAt = nextAds.next_ad_at?.getTime() ?? 0;
    if (!nextAdAt) {
      ircContext.send(`@${redemption.user.display_name} no ads planned yet`);
      return;
    }

    const timeTillNextAds = nextAdAt - Date.now();
    const shouldSnooze = timeTillNextAds > 0 && timeTillNextAds < 2 * MINUTE_MS && nextAds.snooze_count > 0;

    if (timeTillNextAds >= 2 * MINUTE_MS) {
      const nextAdsAfterTimeStr = getTimeAgo(nextAdAt);

      ircContext.send(
        `@${redemption.user.display_name} next ads in ${nextAdsAfterTimeStr} [Snoozes remaining: ${nextAds.snooze_count}]`,
      );
      return;
    }

    if (nextAds.snooze_count < 1) {
      ircContext.send(`@${redemption.user.display_name} no available snoozes :C CODE 114`);
      return;
    }

    if (shouldSnooze) {
      await twitchHelixBroadcasterApiManaged.postAdsSnooze();
      const nextAdsAfterM = await twitchHelixBroadcasterApiManaged.getChannelAds();
      if (nextAdsAfterM.isErr()) {
        ircContext.send(`@${redemption.user.display_name} no idea what happen, ads should be snoozed though CODE 113`);
        return;
      }
      const nextAdsAfter = nextAdsAfterM.unwrap();
      const nextAdAtAfter = nextAdsAfter.next_ad_at?.getTime() ?? 0;
      if (!nextAdAtAfter) {
        ircContext.send(`@${redemption.user.display_name} no ads planned Kappa CODE 112`);
        return;
      }
      const nextAdsAfterTime = nextAdAtAfter - Date.now();
      const nextAdsAfterTimeStr = getTimeAgo(nextAdAtAfter);

      ircContext.send(
        `@${redemption.user.display_name} ads snoozed, next ads in ${nextAdsAfterTimeStr} [Snoozes remaining: ${nextAdsAfter.snooze_count}]`,
      );
      return;
    }

    ircContext.send(`@${redemption.user.display_name} there was an error, thanks for points C: CODE 111`);
  });
};
