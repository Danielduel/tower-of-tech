import { HandlerForRoute } from "@/packages/api/v1/types.ts";
import { discordChannelToBeatSaberPlaylist } from "@/packages/discord/commands/api/discordChannelToBeatSaberPlaylist.ts";
import { getPlaylistFileNameFromPlaylistForDiscord } from "@/packages/playlist/getPlaylistFileNameFromPlaylist.ts";

export const apiV1HandlerDiscordCommandWebhook = "/api/v1/discord/command-webhook";

export const apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdRoute =
  "/api/v1/discord/playlist/get/guild/:guildId/channel/:channelId";
export const apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdDownloadRoute =
  "/api/v1/discord/playlist/get/guild/:guildId/channel/:channelId/download";
export const apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdOneClickRoute =
  "/api/v1/discord/playlist/get/guild/:guildId/channel/:channelId/oneclick/:desiredFileName";

export const apiV1HandlerDiscordGetPlaylistByGuildIdChannelId: HandlerForRoute<
  typeof apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdRoute
> = async (req, ctx, { channelId, guildId }) => {
  const data = await discordChannelToBeatSaberPlaylist(
    guildId,
    channelId,
  );
  if (!data) return new Response("404", { status: 404 });

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdDownload: HandlerForRoute<
  typeof apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdDownloadRoute
> = async (req, ctx, { channelId, guildId }) => {
  const data = await discordChannelToBeatSaberPlaylist(
    guildId,
    channelId,
  );
  if (!data) return new Response("404", { status: 404 });
  const filename = getPlaylistFileNameFromPlaylistForDiscord(data);

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "text/bplist",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    },
  );
};

export const apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdOneClick: HandlerForRoute<
  typeof apiV1HandlerDiscordGetPlaylistByGuildIdChannelIdOneClickRoute
> = async (req, ctx, { channelId, guildId }) => {
  const data = await discordChannelToBeatSaberPlaylist(
    guildId,
    channelId,
  );
  if (!data) return new Response("404", { status: 404 });
  const filename = getPlaylistFileNameFromPlaylistForDiscord(data); // technically it is unused afaik, leaving it as nice to have

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "text/bplist",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    },
  );
};
