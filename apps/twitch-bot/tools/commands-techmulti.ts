import { createTwitchIRC } from "@/apps/twitch-bot/sockets/twitch-irc.ts";
import { defaultHeaders, TwitchBotAuthApi } from "@/packages/api-twitch/auth-api.ts";
import { getChannelDataByBroadcasterName, setChannelData } from "@/packages/api-twitch/helix/TwitchHelixApiClient.ts";
import { getUserToken } from "@/packages/api-twitch/auth-api-get-user-access-token.e2e.ts";
import { getRelativeTimeTechMulti } from "@/packages/discord/cron/tech-multi/utils.ts";
import { createAppAuthorizationHeaders, createUserAuthorizationHeaders } from "@/packages/api-twitch/helix/common.ts";
import { registerCommands } from "@/apps/twitch-bot/common/danielduel-commands.ts";
import { registerTechMultiReminderRedeem } from "@/apps/twitch-bot/common/registerTechMultiReminderRedeem.ts";
import { registerSnoozeAdsRedeem } from "@/apps/twitch-bot/common/registerSnoozeAdsRedeem.ts";
import { registerAdsWarningLoop } from "@/apps/twitch-bot/common/registerAdsWarningLoop.ts";
import { TwitchHelixBroadcasterApiManaged } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApiManaged.ts";
import { TwitchPubSubManager } from "@/packages/api-twitch/pubsub/TwitchPubSubManager.ts";
import { TwitchAdScheduleTaskManager } from "@/packages/api-twitch/helix/TwitchAdScheduleTaskManager.ts";
import { registerFirstOnStreamRedeem } from "@/apps/twitch-bot/common/registerFirstOnStreamRedeem.ts";
import { BeatSaberGameId } from "@/packages/api-twitch/utils/constants.ts";

const client_id = Deno.env.get("TWITCH_API_CLIENT_ID")!;
const channel = Deno.env.get("TWITCH_IRC_COMMANDS_CHANNEL")!;
const nick = Deno.env.get("TWITCH_IRC_COMMANDS_LOGIN")!;
const pass = Deno.env.get("TWITCH_IRC_COMMANDS_PASS")!;

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

const [pubSub, pubSubCleanup, pubSubContext] = await twitchHelixBroadcasterApiManaged.getEventSub();

const twitchPubSubManager = new TwitchPubSubManager(pubSub, pubSubContext);
const twitchAdScheduleManager =
  (await TwitchAdScheduleTaskManager.fromTwitchHelixBroadcasterApi(twitchHelixBroadcasterApiManaged)).unwrap();

await registerSnoozeAdsRedeem(
  twitchPubSubManager,
  ircContext,
  twitchHelixBroadcasterApiManaged,
  twitchAdScheduleManager,
);
await registerFirstOnStreamRedeem(twitchPubSubManager, ircContext, twitchHelixBroadcasterApiManaged);
await registerTechMultiReminderRedeem(twitchPubSubManager, ircContext, twitchHelixBroadcasterApiManaged);
registerCommands(irc, twitchHelixBroadcasterApiManaged);
registerAdsWarningLoop(twitchHelixBroadcasterApiManaged, twitchAdScheduleManager, ircContext);

Deno.addSignalListener("SIGINT", () => {
  ircCleanup();
  console.log("\nParted");
  pubSubCleanup();
  console.log("\nPubSub cleanup");
  Deno.exit();
});

const client_secret = Deno.env.get("TWITCH_API_CLIENT_SECRET")!;
const grant_type = Deno.env.get("TWITCH_API_GRANT_TYPE")!;
const masterChannel = Deno.env.get("TWITCH_API_MASTER_CHANNEL")!;
const masterChannelId = Deno.env.get("TWITCH_API_MASTER_CHANNEL_ID")!;

const urlParams = new URLSearchParams({
  client_id,
  client_secret,
  grant_type,
});

const authResponse = await TwitchBotAuthApi.token.post({
  headers: defaultHeaders,
  body: { __STRIP_URL_STRING__: urlParams.toString() },
});

console.log(authResponse);

if (!authResponse.data) Deno.exit();

const channelResponse = await getChannelDataByBroadcasterName(
  createAppAuthorizationHeaders(client_id, authResponse.data.access_token),
  masterChannel,
);

console.log(channelResponse);

const updateChannelData = async (time: string, stage: string, progress: string) => {
  return await setChannelData(
    createUserAuthorizationHeaders(client_id, userCreds.access_token),
    channelResponse.data?.data[0].id!,
    {
      game_id: BeatSaberGameId,
      title: `ᕕ(⌐■_■)ᕗ ♪♬ | ${progress} | Weekly Tech Multi (public lobby, ${time}, ${stage})`,
    },
  );
};

let lastChatTechMultiStage = "";
const broadcastTechMultiData = async () => {
  const state = getRelativeTimeTechMulti();
  if (lastChatTechMultiStage !== state.stage) {
    ircContext.send(`Lobby state is ${state.stage}`);
    lastChatTechMultiStage = state.stage;
  }
  return await updateChannelData(state.time, state.stage, state.progress);
};

setInterval(() => {
  try {
    console.log("Update state");
    broadcastTechMultiData()
      .then(() => console.log("Update done"));
  } catch (err) {
    console.error(err);
  }
}, 1 * 60 * 1000);

broadcastTechMultiData();
