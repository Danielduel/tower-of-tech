import {
  apiV1HandlerGetPlaylistByIdOneClick,
  apiV1HandlerGetPlaylistByIdOneClickRoute,
} from "@/packages/api/v1/playlist/get.ts";
import {
  apiV1HandlerGetPlaylistById,
  apiV1HandlerGetPlaylistByIdDownload,
  apiV1HandlerGetPlaylistByIdDownloadRoute,
  apiV1HandlerGetPlaylistByIdRoute,
} from "@/packages/api/v1/playlist/get.ts";
import { router } from "https://raw.githubusercontent.com/Danielduel/rutt/cc92a9ea0f94514f48e583aae01bbaa00fc76397/mod.ts";
import {
  apiV1HandlerDiscordCommandWebhook,
  apiV1HandlerDiscordGetPlaylistByGuildIdChannelId,
  apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdDownload,
  apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdDownloadRoute,
  apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdOneClick,
  apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdOneClickRoute,
  apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdRoute,
} from "@/packages/api/v1/discord/get.ts";
import { commandRoot } from "@/packages/discord/commands/mod.ts";
import {
  apiV1HandlerAuthDiscordOauthCallback,
  apiV1HandlerAuthDiscordOauthCallbackRoute,
  apiV1HandlerAuthDiscordOauthSignIn,
  apiV1HandlerAuthDiscordOauthSignInRoute,
  apiV1HandlerAuthDiscordOauthSignOut,
  apiV1HandlerAuthDiscordOauthSignOutRoute,
} from "@/packages/api/v1/auth/discord.ts";

import {
  apiV1HandlerAuthBeatLeaderOauthCallback,
  apiV1HandlerAuthBeatLeaderOauthCallbackRoute,
  apiV1HandlerAuthBeatLeaderOauthSignIn,
  apiV1HandlerAuthBeatLeaderOauthSignInRoute,
  apiV1HandlerAuthBeatLeaderOauthSignOut,
  apiV1HandlerAuthBeatLeaderOauthSignOutRoute,
} from "@/packages/api/v1/auth/beatleader.ts";

const route = router({
  [apiV1HandlerAuthDiscordOauthSignInRoute]: apiV1HandlerAuthDiscordOauthSignIn,
  [apiV1HandlerAuthDiscordOauthSignOutRoute]: apiV1HandlerAuthDiscordOauthSignOut,
  [apiV1HandlerAuthDiscordOauthCallbackRoute]: apiV1HandlerAuthDiscordOauthCallback,

  [apiV1HandlerAuthBeatLeaderOauthSignInRoute]: apiV1HandlerAuthBeatLeaderOauthSignIn,
  [apiV1HandlerAuthBeatLeaderOauthSignOutRoute]: apiV1HandlerAuthBeatLeaderOauthSignOut,
  [apiV1HandlerAuthBeatLeaderOauthCallbackRoute]: apiV1HandlerAuthBeatLeaderOauthCallback,

  [apiV1HandlerGetPlaylistByIdRoute]: apiV1HandlerGetPlaylistById,
  [apiV1HandlerGetPlaylistByIdDownloadRoute]: apiV1HandlerGetPlaylistByIdDownload,
  [apiV1HandlerGetPlaylistByIdOneClickRoute]: apiV1HandlerGetPlaylistByIdOneClick,
  [apiV1HandlerDiscordCommandWebhook]: commandRoot,
  [apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdRoute]: apiV1HandlerDiscordGetPlaylistByGuildIdChannelId,
  [apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdDownloadRoute]:
    apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdDownload,
  [apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdOneClickRoute]:
    apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdOneClick,
});

export const apiV1Handler = async (request: Request) => {
  return await route(request, { remoteAddr: [][0] });
};
