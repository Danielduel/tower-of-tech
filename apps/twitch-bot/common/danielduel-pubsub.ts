import { getChannelAds, getChannelDataByBroadcasterName } from "@/packages/api-twitch/helix-api.ts";
import { getUserToken } from "@/packages/api-twitch/auth-api-get-user-access-token.e2e.ts";
import { TwitchIRCEventContext } from "@/apps/twitch-bot/types.ts";
import { createTwitchPubSub } from "@/apps/twitch-bot/sockets/twitch-pubsub.ts";
import { getRelativeTime } from "@/packages/discord/cron/tech-multi/utils.ts";
import { createUserAuthorizationHeaders } from "@/packages/api-twitch/helix-schema/common.ts";
import { BroadcasterId, UserAccessToken } from "@/packages/api-twitch/helix-schema/brand.ts";
import { MINUTE_MS } from "@/packages/utils/time.ts";

const client_id = Deno.env.get("TWITCH_API_CLIENT_ID")!;
const masterChannel = Deno.env.get("TWITCH_API_MASTER_CHANNEL")!;

const registerAdsWarningLoop = async (
  broadcasterId: BroadcasterId,
  accessToken: UserAccessToken,
  ircContext: TwitchIRCEventContext,
) => {
  const adsResponse = await getChannelAds(
    createUserAuthorizationHeaders(client_id, accessToken),
    broadcasterId,
  );

  const next_ad_at = adsResponse.data?.data[0].next_ad_at;

  console.log(next_ad_at?.toString());

  if (!next_ad_at) {
    setTimeout(() => {
      registerAdsWarningLoop(broadcasterId, accessToken, ircContext);
    }, 5 * MINUTE_MS);
    return;
  }

  const nextAdsWarning = next_ad_at.getTime() - Date.now() - 3 * MINUTE_MS;

  console.log(nextAdsWarning);

  if (nextAdsWarning < 0) {
    setTimeout(() => {
      registerAdsWarningLoop(broadcasterId, accessToken, ircContext);
    }, 5 * MINUTE_MS);
    return;
  }

  setTimeout(() => {
    ircContext.send("! Ads warning in 3 minutes");
    registerAdsWarningLoop(broadcasterId, accessToken, ircContext);
  }, nextAdsWarning);
  return;
};

export const registerPubSub = async (ircContext: TwitchIRCEventContext) => {
  const userCreds = await getUserToken();

  const channelResponse = await getChannelDataByBroadcasterName(
    // @ts-ignore Need to migrate the api client to use header unions
    createUserAuthorizationHeaders(client_id, userCreds.access_token),
    masterChannel,
  );

  if (!channelResponse.data) {
    return;
  }

  registerAdsWarningLoop(channelResponse.data.data[0].id, userCreds.access_token, ircContext);

  // @ts-ignore Need to migrate the api client to use header unions
  const [stream, cleanup, context] = await createTwitchPubSub(channelResponse.data?.data[0].id, userCreds.access_token);

  Deno.addSignalListener("SIGINT", () => {
    cleanup();
    console.log("\nQuit pubsub\n\n");
  });

  context.listenTopics(["channel-points-channel-v1"]);

  stream.on("reward_redeemed", ({ reward, redemption }) => {
    if (reward.id === "6c83f713-274f-4cc0-bbfb-8e8af3fc880f") {
      const relativeTime = getRelativeTime();
      ircContext.send(`@${redemption.user.display_name} the tech multi happens in ${relativeTime.relativeStart}`);
    }
  });
};
