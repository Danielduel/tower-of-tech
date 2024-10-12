import { TwitchHelixBroadcasterApi } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApi.ts";
import { TwitchIRCEventContext } from "@/apps/twitch-bot/types.ts";
import { MINUTE_MS, SECOND_MS } from "@/packages/utils/time.ts";
import { twitchBotLogger } from "@/apps/twitch-bot/common/shared.ts";
import { getTimeAgo } from "@/packages/discord/cron/tech-multi/utils.ts";

const RETRY_DELAY = 15 * SECOND_MS;

export const registerAdsWarningLoop = async (
  twitchHelixBroadcasterApi: TwitchHelixBroadcasterApi,
  ircContext: TwitchIRCEventContext,
) => {
  const prefixLog = (msg: string | Error) => `registerAdsWarning/${twitchHelixBroadcasterApi.broadcasterLogin} ${msg}`;
  const adsResponseM = await twitchHelixBroadcasterApi.getChannelAds();

  if (adsResponseM.isErr()) {
    twitchBotLogger.warn(prefixLog(adsResponseM.unwrapErr()));
    setTimeout(() => {
      registerAdsWarningLoop(twitchHelixBroadcasterApi, ircContext);
    }, RETRY_DELAY);
    return;
  }

  const { next_ad_at, snooze_count } = adsResponseM.unwrap();

  if (!next_ad_at) {
    twitchBotLogger.info(prefixLog("no next ad set"));
    setTimeout(() => {
      registerAdsWarningLoop(twitchHelixBroadcasterApi, ircContext);
    }, RETRY_DELAY);
    return;
  }

  if (next_ad_at.getTime() < Date.now()) {
    twitchBotLogger.info(prefixLog("next_ad_at is in the past"));
    setTimeout(() => {
      registerAdsWarningLoop(twitchHelixBroadcasterApi, ircContext);
    }, RETRY_DELAY);
    return;
  }

  const handleWarning = () => {
    twitchBotLogger.debug(prefixLog("handleWarning"));
    const nextAdAtStr = getTimeAgo(next_ad_at);
    ircContext.send(`! Ads warning in ${nextAdAtStr} [Snoozes remaining: ${snooze_count}]`);
    registerAdsWarningLoop(twitchHelixBroadcasterApi, ircContext);
  };

  const nonprefferedNextAdsWarning = next_ad_at.getTime() - Date.now();
  const preferredNextAdsWarning = nonprefferedNextAdsWarning - 2 * MINUTE_MS;

  if (preferredNextAdsWarning > 0) {
    twitchBotLogger.debug(prefixLog("using preferredNextAdsWarning timing"));
    setTimeout(handleWarning, preferredNextAdsWarning);
    return;
  }

  if (nonprefferedNextAdsWarning > 0) {
    twitchBotLogger.debug(prefixLog("using nonprefferedNextAdsWarning timing"));
    setTimeout(handleWarning, nonprefferedNextAdsWarning);
    return;
  }

  twitchBotLogger.info(prefixLog("preferredNextAdsWarning and nonprefferedNextAdsWarning failed"));
  setTimeout(() => {
    registerAdsWarningLoop(twitchHelixBroadcasterApi, ircContext);
  }, RETRY_DELAY);
  return;
};
