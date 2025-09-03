import { Handlers } from "$fresh/server.ts";
import { getPlaylistIdFromPlaylistIdWithExtension } from "@/packages/playlist/getPlaylistIdFromPlaylistIdWithExtension.ts";
import { utils } from "@tot/db-schema";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const playlistIdWithFileExtension = ctx.params.playlistIdWithFileExtension;
    const beatleaderPlayerId = ctx.params.playerId;

    if (!playlistIdWithFileExtension) throw 400;
    if (!beatleaderPlayerId) throw 400;
    const playlistId = getPlaylistIdFromPlaylistIdWithExtension(
      playlistIdWithFileExtension,
    );

    const returns = await utils.fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndBeatLeaderScoresForPlayerId(playlistId, beatleaderPlayerId);

    return new Response(
      JSON.stringify(returns),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
};
