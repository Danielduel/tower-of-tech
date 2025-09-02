import { Handlers } from "$fresh/server.ts";
import { getPlaylistIdFromPlaylistIdWithExtension } from "@/packages/playlist/getPlaylistIdFromPlaylistIdWithExtension.ts";
import { utils } from "@tot/db-schema";
import { BeatLeaderApi } from "@/packages/api-beatleader/api.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const playlistIdWithFileExtension = ctx.params.playlistIdWithFileExtension;
    const beatleaderPlayerId = ctx.params.playerId;

    if (!playlistIdWithFileExtension) throw 400;
    if (!beatleaderPlayerId) throw 400;

    const playlistId = getPlaylistIdFromPlaylistIdWithExtension(
      playlistIdWithFileExtension,
    );
    const data = await utils.fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem(
      playlistId,
    );
    if (!data) return new Response("404", { status: 404 });
    
    // const playerData = await BeatLeaderApi.playerByIdScoresCompact.post({
    //   body: [data],
    //   urlParams: {
    //     playerId: beatleaderPlayerId
    //   }
    // });
    const playerDataR = await fetch(`https://api.beatleader.xyz/player/${beatleaderPlayerId}/scores/compact`, {
      body: JSON.stringify([data]),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    });
    const playerData = await playerDataR.json();

    return new Response(
      JSON.stringify({
        playlist: data,
        playerData
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
};
