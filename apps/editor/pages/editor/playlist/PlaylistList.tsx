import { FC } from "react";
import { useParams } from "react-router-dom";
import { trpc } from "../../../../../packages/trpc/trpc-react.ts";
import { Playlist } from "./PlaylistItem.tsx";

export const PlaylistList: FC = () => {
  const { playlistId } = useParams();
  const { data: playlist } = trpc.playlist.getById.useQuery({ id: playlistId }, { enabled: !!playlistId, staleTime: Infinity });

  if (playlist) {
    return <Playlist key={playlist.id} playlist={playlist} />
  }

  return null;
};
