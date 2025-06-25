import { TwitchPubSubManager } from "@/packages/api-twitch/pubsub/TwitchPubSubManager.ts";
import { TwitchIRCEventContext } from "@/apps/twitch-bot/types.ts";
import { TwitchHelixBroadcasterApiManaged } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApiManaged.ts";

export const registerFirstOnStreamRedeem = async (
  twitchPubSubManager: TwitchPubSubManager,
  ircContext: TwitchIRCEventContext,
  twitchHelixBroadcasterApiManaged: TwitchHelixBroadcasterApiManaged,
) => {
  const firstOnStreamRedeemM = await twitchHelixBroadcasterApiManaged.getOrUpsertCustomPointReward(
    "firstOnStreamRedeem",
    {
      title: "First!",
      cost: 1,
      max_per_stream: 1,
      is_max_per_stream_enabled: true,
      should_redemptions_skip_request_queue: true,
    },
    {
      title: "First!",
      max_per_stream: 1,
      is_max_per_stream_enabled: true,
      is_paused: false,
      is_enabled: true,
    },
  );

  if (firstOnStreamRedeemM.isErr()) {
    console.error(firstOnStreamRedeemM.unwrapErr());
    return;
  }
  const firstOnStreamRedeem = firstOnStreamRedeemM.unwrap();

  twitchPubSubManager.registerRewardRedeemedCallback(firstOnStreamRedeem.id, async ({ event: redemption }) => {
    const name = redemption.user_name ?? redemption.user_login;
    const updatedRedeemM = await twitchHelixBroadcasterApiManaged.updateCustomPointReward(firstOnStreamRedeem.id, {
      title: `${name} was first!`,
    });
    if (updatedRedeemM.isErr()) {
      ircContext.send(`! Something went wrong with the first redeem`);
      return;
    }
    ircContext.send(`! ${name} is first!`);
  });
};
