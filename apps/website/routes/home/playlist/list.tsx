import { Handlers, PageProps } from "$fresh/server.ts";
import { utils } from "@tot/db-schema";
import { BeatSaberPlaylistFlatSchemaT } from "../../../../../packages/types/beatsaber-playlist.ts";

export const handler: Handlers<BeatSaberPlaylistFlatSchemaT[]> = {
  async GET(_req, ctx) {
    const playlists = await utils.playlistListLinks();

    if (!playlists) return ctx.renderNotFound({ message: "Playlists not found" });
    if (playlists.length < 1) return ctx.renderNotFound({ message: "No playlists found" });

    const playlistsWithImageUrls = await Promise.all(playlists.map(async (x) => {
      const imageUrl = await utils.getImageUrl(
        x.id,
      );
      return ({
        ...x,
        imageUrl,
      });
    }));

    return ctx.render(playlistsWithImageUrls);
  },
};

const PlaylistListPage = (props: PageProps<BeatSaberPlaylistFlatSchemaT[]>) => {
  return (
    <div class="mt-4">
      {props.data.map((v) => {
        return (
          <a href={`/home/playlist/${v.id}/details`} class="hover:underline">
            <div class="flex flex-row m-4">
              <img class="h-16 w-16" src={v.imageUrl} />
              <div class="mb-2 ml-4">
                <div>{v.playlistTitle}</div>
                <div>{v.playlistAuthor}</div>
              </div>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default PlaylistListPage;
