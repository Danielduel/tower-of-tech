import { defaultHeaders, TwitchBotAuthApi } from "@/packages/api-twitch/auth-api.ts";
import { Err, Ok, Result } from "@/packages/utils/optionals.ts";
import { AppTokenSuccessSchemaT } from "@/packages/api-twitch/helix/common.ts";

export const getAuthAppToken = async (): Promise<Result<AppTokenSuccessSchemaT, Error>> => {
  const client_id = Deno.env.get("TWITCH_API_CLIENT_ID")!;
  const client_secret = Deno.env.get("TWITCH_API_CLIENT_SECRET")!;
  const grant_type = Deno.env.get("TWITCH_API_GRANT_TYPE")!;

  const urlParams = new URLSearchParams({
    client_id,
    client_secret,
    grant_type,
  });

  const authResponse = await TwitchBotAuthApi.token.post({
    headers: defaultHeaders,
    body: { __STRIP_URL_STRING__: urlParams.toString() },
  });

  if (authResponse.ok) {
    return Ok(authResponse.data);
  }

  return Err(authResponse.error ?? "");
};
