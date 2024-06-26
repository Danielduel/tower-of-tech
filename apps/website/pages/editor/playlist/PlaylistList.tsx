import { FC } from "react";
import { useParams } from "react-router-dom";
import { Playlist } from "@/apps/website/pages/editor/playlist/PlaylistItem.tsx";
import { trpc } from "@/packages/trpc/trpc-react.ts";
import { semiconstantCacheQuery } from "@/packages/react-query/constants.ts";

export const PlaylistList: FC = () => {
  const { playlistId } = useParams();
  const { data: playlist } = trpc.playlist.getById.useQuery(
    { id: playlistId! },
    { ...semiconstantCacheQuery, enabled: !!playlistId },
  );

  if (playlist) {
    return (
      <Playlist
        prependKey={playlist.id}
        key={playlist.id}
        playlist={playlist}
      />
    );
  }

  return null;
};
