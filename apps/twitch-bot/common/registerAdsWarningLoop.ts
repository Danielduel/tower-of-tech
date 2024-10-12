import { TwitchHelixBroadcasterApi } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApi.ts";
import { TwitchIRCEventContext } from "@/apps/twitch-bot/types.ts";
import { MINUTE_MS } from "@/packages/utils/time.ts";

export const registerAdsWarningLoop = async (
  twitchHelixBroadcasterApi: TwitchHelixBroadcasterApi,
  ircContext: TwitchIRCEventContext,
) => {
  const adsResponseM = await twitchHelixBroadcasterApi.getChannelAds();

  if (adsResponseM.isErr()) {
    setTimeout(() => {
      registerAdsWarningLoop(twitchHelixBroadcasterApi, ircContext);
    }, 2 * MINUTE_MS);
    return;
  }

  const { next_ad_at, snooze_count } = adsResponseM.unwrap();

  if (!next_ad_at) {
    setTimeout(() => {
      registerAdsWarningLoop(twitchHelixBroadcasterApi, ircContext);
    }, 2 * MINUTE_MS);
    return;
  }

  const nextAdsWarning = next_ad_at.getTime() - Date.now() - 2 * MINUTE_MS;

  if (nextAdsWarning < 0) {
    setTimeout(() => {
      registerAdsWarningLoop(twitchHelixBroadcasterApi, ircContext);
    }, 2 * MINUTE_MS);
    return;
  }

  setTimeout(() => {
    ircContext.send(`! Ads warning in 2 minutes [Snoozes remaining: ${snooze_count}]`);
    registerAdsWarningLoop(twitchHelixBroadcasterApi, ircContext);
  }, nextAdsWarning);
  return;
};
