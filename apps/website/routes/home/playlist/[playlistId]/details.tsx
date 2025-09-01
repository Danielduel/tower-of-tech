import { FunctionComponent } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { makePlaylistId } from "@/packages/types/brands.ts";
import { utils } from "@tot/db-schema";
import { CopyButton } from "../../../../islands/CopyButton.tsx";

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
      <div>
        <div class="m-4">
          <div class="flex flex-row">
            <img class="h-32" src={"data:image/png;base64," + data.image} />
            <div class="ml-4">
              <h4>{data.playlistTitle}</h4>
              <h5>{data.playlistAuthor}</h5>
            </div>
          </div>
        </div>
        <div class="m-6">
          {data.songs.map((v) => (
            <div class="flex flex-row m-4">
              <img class="h-20 w-20" src={v.coverUrl} />
              <div class="ml-4">
                <div>{v.songName}</div>
                <div>{v.levelAuthorName}</div>
                <div>
                  {v.key
                    ? <CopyButton childText={`!bsr ${v.key}`} copyText={`!bsr ${v.key}`} />
                    : "Unavailable on BeatSaver"}
                </div>

                <div>{v.difficulties.map((x) => `${x.name} (${x.characteristic})`).join(", ")}</div>
                <div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default PlaylistDetailsPage;
