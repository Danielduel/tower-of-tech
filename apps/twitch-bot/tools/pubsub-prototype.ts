import { getUserToken } from "@/packages/api-twitch/auth-api-get-user-access-token.e2e.ts";
import { createTwitchPubSub } from "@/apps/twitch-bot/sockets/twitch-pubsub.ts";
import { getChannelDataByBroadcasterName } from "@/packages/api-twitch/helix-api.ts";
import { createUserAuthorizationHeaders } from "@/packages/api-twitch/helix-schema/common.ts";

const client_id = Deno.env.get("TWITCH_API_CLIENT_ID")!;
const client_secret = Deno.env.get("TWITCH_API_CLIENT_SECRET")!;
const grant_type = Deno.env.get("TWITCH_API_GRANT_TYPE")!;
const masterChannel = Deno.env.get("TWITCH_API_MASTER_CHANNEL")!;
const masterChannelId = Deno.env.get("TWITCH_API_MASTER_CHANNEL_ID")!;

const userCreds = await getUserToken();

const channelResponse = await getChannelDataByBroadcasterName(
  // @ts-ignore Need to migrate the api client to use header unions
  createUserAuthorizationHeaders(client_id, userCreds.access_token),
  masterChannel,
);

console.log(channelResponse);

// @ts-ignore Need to migrate the api client to use header unions
const [stream, cleanup, context] = await createTwitchPubSub(channelResponse.data?.data[0].id, userCreds.access_token);

context.listenTopics(["channel-points-channel-v1"]);

Deno.addSignalListener("SIGINT", () => {
  cleanup();
  console.log("\nParted\n\n");
  Deno.exit();
});
