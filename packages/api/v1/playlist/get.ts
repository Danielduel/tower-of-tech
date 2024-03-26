import { HandlerForRoute } from "@/packages/api/v1/types.ts";
import { playlistIdWithFileExtensionToPlaylistId } from "@/packages/api/v1/playlist/util.ts";
import { fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage } from "@/packages/database-editor/utils.ts";

export const apiV1HandlerGetPlaylistByIdRoute =
  "/api/v1/playlist/get/:playlistIdWithFileExtension";
export const apiV1HandlerGetPlaylistByIdDownloadRoute =
  "/api/v1/playlist/get/:playlistIdWithFileExtension/download";

export const apiV1HandlerGetPlaylistById: HandlerForRoute<
  typeof apiV1HandlerGetPlaylistByIdRoute
> = async (req, ctx, { playlistIdWithFileExtension }) => {
  const playlistId = playlistIdWithFileExtensionToPlaylistId(
    playlistIdWithFileExtension,
  );
  const data =
    await fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage(
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
  const playlistId = playlistIdWithFileExtensionToPlaylistId(
    playlistIdWithFileExtension,
  );
  const data =
    await fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage(
      playlistId,
    );
  if (!data) return new Response("404", { status: 404 });

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "text/bplist",
        "Content-Disposition":
          `attachment; filename="${data.playlistTitle} by ${data.playlistAuthor}.bplist"`,
      },
    },
  );
};
