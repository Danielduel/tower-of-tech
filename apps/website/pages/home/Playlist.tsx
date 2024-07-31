import { VisualNovelContainer } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { forwardRef } from "react";
import { useParams } from "react-router-dom";
import { trpc } from "@/packages/trpc/trpc-react.ts";
import { PlaylistMaps } from "@/apps/website/pages/editor/playlist/PlaylistItem.tsx";
import { VisualNovelDivider } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { VisualNovelLink } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { VisualNovelAnchor } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { links } from "@/apps/website/routing.config.ts";
import { makePlaylistId } from "@/packages/types/brands.ts";
import { towerOfTechWebsiteOrigin } from "@/packages/utils/constants.ts";
import { getPlaylistFileNameFromPlaylist } from "@/packages/playlist/getPlaylistFileNameFromPlaylist.ts";
import { semiconstantCacheQuery } from "@/packages/react-query/constants.ts";

export const PlaylistDetails = forwardRef<HTMLDivElement>((_, ref) => {
  const { playlistId } = useParams();
  const { data } = trpc.playlist.getById.useQuery({ id: playlistId! }, {
    ...semiconstantCacheQuery,
    enabled: !!playlistId,
  });

  if (!playlistId) return null;
  if (!data) return "Loading...";

  const brandedPlaylistId = makePlaylistId(playlistId);

  return (
    <VisualNovelContainer
      imageUrl={data.imageUrl}
      ref={ref}
      row
      header={
        <div className="text-left md:text-right mt-5">
          <div className="ml-5 md:ml-0">
            <div className="text-2xl">
              {data?.playlistTitle}
            </div>
            <div className="text-xl">
              {data?.playlistAuthor}
            </div>
            <div className="text-xl">
              Items: {data.songs.length}
            </div>
          </div>

          <VisualNovelDivider />

          {playlistId && (
            <VisualNovelAnchor
              href={links.api.v1.playlist.oneClick(
                brandedPlaylistId,
                getPlaylistFileNameFromPlaylist(data),
                towerOfTechWebsiteOrigin,
              )}
            >
              OneClick
            </VisualNovelAnchor>
          )}
          <VisualNovelAnchor
            href={links.api.v1.playlist.download(brandedPlaylistId)}
            download
          >
            Download
          </VisualNovelAnchor>
          <VisualNovelLink to="/">
            Home
          </VisualNovelLink>
        </div>
      }
    >
      <div className="md:ml-3 md:mt-6">
        {data.songs && <PlaylistMaps prependKey={playlistId} maps={data.songs} />}
      </div>
    </VisualNovelContainer>
  );
});
