import { createAppAuthorizationHeaders } from "@/packages/api-twitch/helix/common.ts";
import { TwitchHelixApiClient } from "@/packages/api-twitch/helix/TwitchHelixApiClient.ts";
import { appAuth } from "@/apps/twitch-bot/resendLink/shared.ts";
import { Err, Ok, Result } from "@/packages/utils/optionals.ts";
import { HelixSearchChannelsItemSchemaT } from "@/packages/api-twitch/helix/helixSearchChannels.ts";

export const extractTwitchName = (name: string): string => {
  const _name = name
    .split("#").filter((x) => !!x)[0]
    .split("@").filter((x) => !!x)[0];

  return _name;
};

export const searchChannelByName = async (name: string): Promise<Result<HelixSearchChannelsItemSchemaT, Error>> => {
  const client_id = Deno.env.get("TWITCH_API_CLIENT_ID")!;
  const query = encodeURI(name);

  const response = await TwitchHelixApiClient.searchChannels.get({
    headers: createAppAuthorizationHeaders(client_id, appAuth.access_token),
    searchParams: {
      query,
    },
  });

  if (!response.data) {
    return Err("No response data");
  }

  const [item] = response.data.data.filter((x) => x.broadcaster_login === name || x.display_name === name);

  if (!item) {
    return Err("No matching item");
  }

  return Ok(item);
};
