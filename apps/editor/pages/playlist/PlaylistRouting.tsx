import { FC, PropsWithChildren } from "react";
import { Route, Routes } from "react-router-dom";
import { tw } from "@/twind/twind.tsx";
import { trpc } from "@/trpc/trpc.ts";
import { WithPlaylists } from "../../../../ui/playlist/types.ts";
import { PlaylistList } from "./PlaylistList.tsx";
import { Link } from "@/ui/Link.tsx";
import { PlaylistFromFile } from "./PlaylistFromFile.tsx";

const PlaylistListing: FC<WithPlaylists> = ({ playlists }) => {
  return playlists.map((playlist) => (
    <Link
      to={`/playlist/list/${playlist.id}`}
      className={tw("p-1 hover:ring-1 ring-neutral-500 w-full")}
      key={playlist.id}
    >
      <h4 className={tw("text-lg text-left")}>{playlist.playlistTitle}</h4>
      <div className={tw("text-xs text-right")}>by {playlist.playlistAuthor}</div>
    </Link>
  ));
};

export const PlaylistLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data: playlists } = trpc.playlist.list.useQuery();

  return (
    <div className="sub-grid-layout">
      <div className={tw("flex flex-col items-start")}>
        <h3 className={tw("text-md text-gray-500")}>Playlist Actions</h3>
        <Link to="/playlist/new" className={tw("text-lg p-1 hover:ring-1 text-left w-full")}>New playlist</Link>
        <Link to="/playlist/from_file" className={tw("text-lg p-1 hover:ring-1 text-left w-full")}>New/Update from file(s)</Link>
        <h3 className={tw("text-md text-gray-500 mt-2")}>Playlist List</h3>
        {playlists && <PlaylistListing playlists={playlists} />}
      </div>
      <div>
        { children }
      </div>
    </div>
  )
}

export const PlaylistRouting = () => {
  return (
    <PlaylistLayout>
      <Routes>
        <Route path="new" element="new" />
        <Route path="from_file" element={<PlaylistFromFile />} />
        <Route path="list" element={<PlaylistList  />} />
        <Route path="list/:playlistId" element={<PlaylistList />} />
      </Routes>
    </PlaylistLayout>
  )
};
