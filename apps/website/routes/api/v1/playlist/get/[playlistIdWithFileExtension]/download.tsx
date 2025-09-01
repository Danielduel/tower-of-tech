import { Handlers } from "$fresh/server.ts";
import { getPlaylistFileNameFromPlaylist } from "@/packages/playlist/getPlaylistFileNameFromPlaylist.ts";
import { getPlaylistIdFromPlaylistIdWithExtension } from "@/packages/playlist/getPlaylistIdFromPlaylistIdWithExtension.ts";
import { utils } from "@tot/db-schema";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const playlistIdWithFileExtension = ctx.params.playlistIdWithFileExtension;

    if (!playlistIdWithFileExtension) throw 400;

    const playlistId = getPlaylistIdFromPlaylistIdWithExtension(
      playlistIdWithFileExtension,
    );
    const data = await utils.fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage(
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
  },
};
