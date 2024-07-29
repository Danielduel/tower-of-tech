import { HandlerForRoute } from "@/packages/api/v1/types.ts";
import { getPlaylistIdFromPlaylistIdWithExtension } from "@/packages/playlist/getPlaylistIdFromPlaylistIdWithExtension.ts";
import { getPlaylistFileNameFromPlaylist } from "@/packages/playlist/getPlaylistFileNameFromPlaylist.ts";
import { fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage } from "@/packages/database-editor/utils.ts";

export const apiV1HandlerGetPlaylistByIdRoute = "/api/v1/playlist/get/:playlistIdWithFileExtension";
export const apiV1HandlerGetPlaylistByIdDownloadRoute = "/api/v1/playlist/get/:playlistIdWithFileExtension/download";
export const apiV1HandlerGetPlaylistByIdOneClickRoute =
  "/api/v1/playlist/get/:playlistIdWithFileExtension/oneclick/:desiredFileName";

export const apiV1HandlerGetPlaylistById: HandlerForRoute<
  typeof apiV1HandlerGetPlaylistByIdRoute
> = async (req, ctx, { playlistIdWithFileExtension }) => {
  const playlistId = getPlaylistIdFromPlaylistIdWithExtension(
    playlistIdWithFileExtension,
  );
  const data = await fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage(
    playlistId,
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

export const apiV1HandlerGetPlaylistByIdDownload: HandlerForRoute<
  typeof apiV1HandlerGetPlaylistByIdDownloadRoute
> = async (req, ctx, { playlistIdWithFileExtension }) => {
  const playlistId = getPlaylistIdFromPlaylistIdWithExtension(
    playlistIdWithFileExtension,
  );
  const data = await fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage(
    playlistId,
  );
  if (!data) return new Response("404", { status: 404 });
  const filename = getPlaylistFileNameFromPlaylist(data);

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

export const apiV1HandlerGetPlaylistByIdOneClick: HandlerForRoute<
  typeof apiV1HandlerGetPlaylistByIdOneClickRoute
> = async (req, ctx, { playlistIdWithFileExtension }) => {
  const playlistId = getPlaylistIdFromPlaylistIdWithExtension(
    playlistIdWithFileExtension,
  );
  const data = await fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage(
    playlistId,
  );
  if (!data) return new Response("404", { status: 404 });
  const filename = getPlaylistFileNameFromPlaylist(data); // technically it is unused afaik, leaving it as nice to have

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
