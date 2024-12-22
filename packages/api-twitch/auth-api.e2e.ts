import { defaultHeaders, TwitchBotAuthApi } from "@/packages/api-twitch/auth-api.ts";
import { getChannelDataByBroadcasterName, setChannelData } from "@/packages/api-twitch/helix/TwitchHelixApiClient.ts";

import { getUserToken } from "@/packages/api-twitch/auth-api-get-user-access-token.e2e.ts";
import { createAppAuthorizationHeaders, createUserAuthorizationHeaders } from "@/packages/api-twitch/helix/common.ts";

const userCredentials = await getUserToken();

const client_id = Deno.env.get("TWITCH_API_CLIENT_ID")!;
const client_secret = Deno.env.get("TWITCH_API_CLIENT_SECRET")!;
const grant_type = Deno.env.get("TWITCH_API_GRANT_TYPE")!;
const masterChannel = Deno.env.get("TWITCH_API_MASTER_CHANNEL")!;

const urlParams = new URLSearchParams({
  client_id,
  client_secret,
  grant_type,
});

const authResponse = await TwitchBotAuthApi.token.post({
  headers: defaultHeaders,
  body: { __STRIP_URL_STRING__: urlParams.toString() },
});

if (!authResponse.data) Deno.exit();

const channelResponse = await getChannelDataByBroadcasterName(
  createAppAuthorizationHeaders(client_id, authResponse.data.access_token),
  masterChannel,
);

console.log(channelResponse);

const patchChannelResponse = await setChannelData(
  createUserAuthorizationHeaders(client_id, userCredentials.access_token),
  channelResponse.data?.data[0].id!,
  {
    title: "",
  },
);

console.log(patchChannelResponse);
