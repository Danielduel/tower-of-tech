import { Handlers } from "$fresh/server.ts";
import { getPlaylistIdFromPlaylistIdWithExtension } from "@/packages/playlist/getPlaylistIdFromPlaylistIdWithExtension.ts";
import { fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage } from "@/packages/database-editor/utils.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const playlistIdWithFileExtension = ctx.params.playlistIdWithFileExtension;

    if (!playlistIdWithFileExtension) throw 400;

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
  },
};

