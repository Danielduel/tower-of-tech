import { TwitchIRCEventContext } from "@/apps/twitch-bot/types.ts";
import { getRelativeTime, getRelativeTimeNextWeek } from "@/packages/discord/cron/tech-multi/utils.ts";
import { TwitchPubSubManager } from "@/packages/api-twitch/pubsub/TwitchPubSubManager.ts";
import { TwitchHelixBroadcasterApiManaged } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApiManaged.ts";

export const registerTechMultiReminderRedeem = async (
  twitchPubSubManager: TwitchPubSubManager,
  ircContext: TwitchIRCEventContext,
  twitchHelixBroadcasterApiManaged: TwitchHelixBroadcasterApiManaged,
) => {
  const nextMultiRedeemM = await twitchHelixBroadcasterApiManaged.getOrUpsertCustomPointReward("nextMultiRedeem", {
    title: "Wow, tech multi next week!",
    cost: 115,
  }, {
    title: "Wow, tech multi next week!",
    cost: 115,
    is_paused: false,
  });

  if (nextMultiRedeemM.isErr()) {
    console.error(nextMultiRedeemM.unwrapErr());
    return;
  }
  const nextMultiRedeem = nextMultiRedeemM.unwrap();

  twitchPubSubManager.registerRewardRedeemedCallback(nextMultiRedeem.id, ({ redemption }) => {
    let relativeTime = getRelativeTime();
    if (relativeTime.isAfter || relativeTime.isDuring) {
      relativeTime = getRelativeTimeNextWeek();
    }
    ircContext.send(`@${redemption.user.display_name} the tech multi happens in ${relativeTime.relativeStart}`);
  });
};
