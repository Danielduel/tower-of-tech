import { FC } from "react";
import { useParams } from "react-router-dom";
import { trpc } from "@/trpc/trpc.ts";
import { Playlist } from "./PlaylistItem.tsx";

export const PlaylistList: FC = () => {
  const { playlistId } = useParams();
  const { data: playlists } = trpc.playlist.list.useQuery();

  return playlists
    ? playlists
      .filter(playlist => playlistId ? playlist.id === playlistId : true)
      .map((playlist) => <Playlist key={playlist.id} playlist={playlist} />)
    : null;
};
