import { VisualNovelContainer } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { forwardRef } from "react";
import { useParams } from "react-router-dom";
import { trpc } from "@/packages/trpc/trpc-react.ts";
import { PlaylistMaps } from "@/apps/editor/pages/editor/playlist/PlaylistItem.tsx";

export const PlaylistDetails = forwardRef<HTMLDivElement>((_, ref) => {
  const { playlistId } = useParams();
  const { data } = trpc.playlist.getById.useQuery({ id: playlistId });

  if (!playlistId) return null;

  return (
    <VisualNovelContainer
      imageUrl={data?.imageUrl}
      ref={ref}
      row
      header={
        <div className="text-right mt-5">
          <div className="text-2xl">
            {data?.playlistTitle}
          </div>
          <div className="text-xl">
            {data?.playlistAuthor}
          </div>
          <div className="text-xl">
            Items: {data?.songs.length}
          </div>
        </div>
      }
    >
      <div className="ml-3 mt-5">
        {data?.songs && <PlaylistMaps maps={data.songs} />}
      </div>
    </VisualNovelContainer>
  );
});
