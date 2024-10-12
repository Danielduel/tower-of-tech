import { createTwitchIRC } from "@/apps/twitch-bot/sockets/twitch-irc.ts";
import { defaultHeaders, TwitchAuthApi } from "@/packages/api-twitch/auth-api.ts";
import {
  getChannelDataByBroadcasterName,
  setChannelData,
} from "../../../packages/api-twitch/helix/TwitchHelixApiClient.ts";
import { getUserToken } from "@/packages/api-twitch/auth-api-get-user-access-token.e2e.ts";
import { getRelativeTimeTechMulti } from "@/packages/discord/cron/tech-multi/utils.ts";
import { createAppAuthorizationHeaders, createUserAuthorizationHeaders } from "@/packages/api-twitch/helix/common.ts";
import { registerCommands } from "@/apps/twitch-bot/common/danielduel-commands.ts";
import { registerPubSub } from "@/apps/twitch-bot/common/registerTechMultiReminderRedeem.ts";

const userCredentials = await getUserToken();

const channel = Deno.env.get("TWITCH_IRC_COMMANDS_CHANNEL")!;
const nick = Deno.env.get("TWITCH_IRC_COMMANDS_LOGIN")!;
const pass = Deno.env.get("TWITCH_IRC_COMMANDS_PASS")!;

const [irc, cleanup, ircContext] = createTwitchIRC({
  channel: channel as `#${string}`,
  debug: true,
  credentials: {
    nick,
    pass,
  },
});

registerCommands(irc);
registerPubSub(ircContext);

Deno.addSignalListener("SIGINT", () => {
  cleanup();
  console.log("\nParted\n\n");
  Deno.exit();
});

const client_id = Deno.env.get("TWITCH_API_CLIENT_ID")!;
const client_secret = Deno.env.get("TWITCH_API_CLIENT_SECRET")!;
const grant_type = Deno.env.get("TWITCH_API_GRANT_TYPE")!;
const masterChannel = Deno.env.get("TWITCH_API_MASTER_CHANNEL")!;
const masterChannelId = Deno.env.get("TWITCH_API_MASTER_CHANNEL_ID")!;

const urlParams = new URLSearchParams({
  client_id,
  client_secret,
  grant_type,
});

const authResponse = await TwitchAuthApi.token.post({
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
    createUserAuthorizationHeaders(client_id, userCredentials.access_token),
    channelResponse.data?.data[0].id!,
    {
      title: `| ${progress} | Weekly Tech Multi (public lobby, ${time}, ${stage})`,
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

// console.log(schedule.scheduledStartTime, schedule.scheduledEndTime);
