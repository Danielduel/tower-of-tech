import { TwitchHelixBroadcasterApi } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApi.ts";
import { TwitchIRCEventContext } from "@/apps/twitch-bot/types.ts";
import { MINUTE_MS, SECOND_MS } from "@/packages/utils/time.ts";
import { twitchBotLogger } from "@/apps/twitch-bot/common/shared.ts";
import { getTimeAgo } from "@/packages/discord/cron/tech-multi/utils.ts";
import { TwitchAdScheduleTaskManager } from "@/packages/api-twitch/helix/TwitchAdScheduleTaskManager.ts";

export const registerAdsWarningLoop = (
  twitchHelixBroadcasterApi: TwitchHelixBroadcasterApi,
  twitchAdScheduleManager: TwitchAdScheduleTaskManager,
  ircContext: TwitchIRCEventContext,
) => {
  const prefixLog = (msg: string | Error) => `registerAdsWarning/${twitchHelixBroadcasterApi.broadcasterLogin} ${msg}`;

  const handleWarning = (warningName: string) => () => {
    twitchBotLogger.debug(prefixLog(`handleWarning ${warningName}`));
    const nextAdAt = twitchAdScheduleManager.getNextAdAtTimeIfValid();
    if (!nextAdAt) {
      twitchBotLogger.debug(prefixLog(`handleWarning ${warningName} - fail`));
      return;
    }
    const nextAdAtStr = getTimeAgo(nextAdAt);
    const snoozeCount = twitchAdScheduleManager.currentAdsSchedule.snooze_count;
    ircContext.send(`! Ads warning in ${nextAdAtStr} [Snoozes remaining: ${snoozeCount}]`);
  };

  twitchAdScheduleManager.pushTimeOffsetTask(handleWarning("2 minute"), 2 * MINUTE_MS);
  twitchAdScheduleManager.pushTimeOffsetTask(handleWarning("30 seconds"), 30 * SECOND_MS);
  twitchAdScheduleManager.pushOnAdsEndedTask(() => {
    ircContext.send(`! Ads ended`);
  });

  return;
};
