
import { FunctionComponent } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { makePlaylistId } from "@/packages/types/brands.ts";
import { utils } from "@tot/db-schema";
import { PlaylistDetails } from "../../../../../../islands/playlist/PlaylistDetails.tsx";

export const handler: Handlers<utils.fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImageT> = {
  async GET(_req, ctx) {
    const playlistId = ctx.params.playlistId;
    if (!playlistId) return ctx.renderNotFound({ message: "PlaylistId invalid" });

    const beatleaderPlayerId = ctx.params.playerId;
    if (!beatleaderPlayerId) return ctx.renderNotFound({ message: "PlayerId invalid"});

    const returns = await utils.fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndBeatLeaderScoresForPlayerId(makePlaylistId(playlistId), beatleaderPlayerId);

    if (!returns) {
      return ctx.renderNotFound({
        message: "Playlist does not exist",
      });
    }

    return ctx.render(returns);
  },
};

const PlaylistDetailsPage: FunctionComponent<PageProps<utils.fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndBeatLeaderScoresForPlayerIdT>> =
  ({ data }) => {
    return (
      <PlaylistDetails playlist={data.playlist} beatLeaderCompactScores={data.beatLeaderCompactScores} imageUrl={data.imageUrl} /> 
    );
  };

export default PlaylistDetailsPage;
