import { createTwitchIRC } from "@/apps/twitch-bot/sockets/twitch-irc.ts";
import { registerCommands } from "@/apps/twitch-bot/common/danielduel-commands.ts";
import { registerTechMultiReminderRedeem } from "@/apps/twitch-bot/common/registerTechMultiReminderRedeem.ts";
import { registerSnoozeAdsRedeem } from "@/apps/twitch-bot/common/registerSnoozeAdsRedeem.ts";
import { getUserToken } from "@/packages/api-twitch/auth-api-get-user-access-token.e2e.ts";
import { registerAdsWarningLoop } from "@/apps/twitch-bot/common/registerAdsWarningLoop.ts";
import { TwitchPubSubManager } from "@/packages/api-twitch/pubsub/TwitchPubSubManager.ts";
import { TwitchHelixBroadcasterApiManaged } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApiManaged.ts";
import { TwitchAdScheduleTaskManager } from "@/packages/api-twitch/helix/TwitchAdScheduleTaskManager.ts";
import { MINUTE_MS } from "@/packages/utils/time.ts";

const client_id = Deno.env.get("TWITCH_API_CLIENT_ID")!;
const channel = Deno.env.get("TWITCH_IRC_COMMANDS_CHANNEL")!;
const nick = Deno.env.get("TWITCH_IRC_COMMANDS_LOGIN")!;
const pass = Deno.env.get("TWITCH_IRC_COMMANDS_PASS")!;
const streamTitle = Deno.env.get("TWITCH_DEFAULT_STREAM_TITLE")!;

const userCreds = await getUserToken();

const twitchHelixBroadcasterApiManagedM = await TwitchHelixBroadcasterApiManaged.createFromUserCreds(
  client_id,
  userCreds,
);
if (twitchHelixBroadcasterApiManagedM.isErr()) {
  console.error("TwitchHelixBroadcasterApiManaged failed to init");
  console.error(twitchHelixBroadcasterApiManagedM.unwrapErr());
  Deno.exit();
}
const twitchHelixBroadcasterApiManaged = twitchHelixBroadcasterApiManagedM.unwrap();

const [irc, ircCleanup, ircContext] = createTwitchIRC({
  channel: channel as `#${string}`,
  debug: true,
  credentials: {
    nick,
    pass,
  },
});

const [pubSub, pubSubCleanup, pubSubContext] = await twitchHelixBroadcasterApiManaged.getPubSub();

const twitchPubSubManager = new TwitchPubSubManager(pubSub, pubSubContext);
const twitchAdScheduleManager =
  (await TwitchAdScheduleTaskManager.fromTwitchHelixBroadcasterApi(twitchHelixBroadcasterApiManaged)).unwrap();

await registerSnoozeAdsRedeem(
  twitchPubSubManager,
  ircContext,
  twitchHelixBroadcasterApiManaged,
  twitchAdScheduleManager,
);
await registerTechMultiReminderRedeem(twitchPubSubManager, ircContext, twitchHelixBroadcasterApiManaged);
registerCommands(irc, twitchHelixBroadcasterApiManaged);
registerAdsWarningLoop(twitchHelixBroadcasterApiManaged, twitchAdScheduleManager, ircContext);

const updateChannelTitle = async () => {
  return await twitchHelixBroadcasterApiManaged.setChannelInfo({
    title: streamTitle,
  });
};

await updateChannelTitle();

Deno.addSignalListener("SIGINT", () => {
  ircCleanup();
  console.log("\nParted");
  pubSubCleanup();
  console.log("\nPubSub cleanup");
  Deno.exit();
});
