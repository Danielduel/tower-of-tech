import { FunctionComponent } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { makePlaylistId } from "@/packages/types/brands.ts";
import { utils } from "@tot/db-schema";
import { CopyButton } from "../../../../islands/CopyButton.tsx";
import { PlaylistDetails } from "../../../../islands/playlist/PlaylistDetails.tsx";

export const handler: Handlers<utils.fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImageT> = {
  async GET(_req, ctx) {
    const playlistId = ctx.params.playlistId;
    if (!playlistId) return ctx.renderNotFound({ message: "PlaylistId invalid" });
    const playlist = await utils.fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage(makePlaylistId(playlistId));

    if (!playlist) {
      return ctx.renderNotFound({
        message: "Playlist does not exist",
      });
    }

    return ctx.render(playlist);
  },
};

const PlaylistDetailsPage: FunctionComponent<PageProps<utils.fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImageT>> =
  ({ data }) => {
    return (
      <PlaylistDetails playlist={data} /> 
    );
  };

export default PlaylistDetailsPage;
