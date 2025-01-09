import { HandlerForRoute } from "@/packages/api/v1/types.ts";
import { getAccountFromRequestM } from "@/packages/api/v1/auth/common.ts";
import { handleTwitchSignOut } from "@/packages/api/v1/auth/twitch-config.ts";
import { handleBeatLeaderSignOut } from "@/packages/api/v1/auth/beatleader-config.ts";
import { handleDiscordSignOut } from "@/packages/api/v1/auth/discord-config.ts";

export const apiV1HandlerAuthMeRoute = "/api/v1/auth/me";
export const apiV1HandlerAuthMeSignOutRoute = "/api/v1/auth/me/signout";

export const apiV1HandlerAuthMe: HandlerForRoute<
  typeof apiV1HandlerAuthMeRoute
> = async (request: Request) => {
  const account = await getAccountFromRequestM(request);
  return new Response(JSON.stringify({ account }, undefined, 2));
};

export const apiV1HandlerAuthMeSignOut: HandlerForRoute<typeof apiV1HandlerAuthMeSignOutRoute> = async (
  request: Request,
) => {
  const _ = await handleTwitchSignOut(request);
  const __ = await handleBeatLeaderSignOut({ ...request, headers: _.headers });
  const ___ = await handleDiscordSignOut({ ...request, headers: __.headers });

  return ___;
};
