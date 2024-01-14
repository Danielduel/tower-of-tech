import { FC } from "react";
import { useParams } from "react-router-dom";
import { Playlist } from "@/apps/editor/pages/editor/playlist/PlaylistItem.tsx";
import { trpc } from "@/packages/trpc/trpc-react.ts";

export const PlaylistList: FC = () => {
  const { playlistId } = useParams();
  const { data: playlist } = trpc.playlist.getById.useQuery({ id: playlistId }, { enabled: !!playlistId, staleTime: Infinity });

  if (playlist) {
    return <Playlist key={playlist.id} playlist={playlist} />
  }

  return null;
};
