import { FC, PropsWithChildren, Suspense } from "react";
import { Link } from "@/apps/website/components/ui/Link.tsx";
import { Route, Routes } from "react-router-dom";
import { trpc } from "@/packages/trpc/trpc-react.ts";
import { WithPlaylistLinks } from "@/apps/website/components/ui/playlist/types.ts";
import { PlaylistList } from "@/apps/website/pages/editor/playlist/PlaylistList.tsx";
import { PlaylistFromFile } from "@/apps/website/pages/editor/playlist/PlaylistFromFile.tsx";
import { semiconstantCacheQuery } from "@/packages/react-query/constants.ts";

const PlaylistListing: FC<WithPlaylistLinks> = ({ playlists }) => {
  return playlists.map((playlist) => (
    <Link
      to={`/editor/playlist/list/${playlist.id}`}
      className="p-1 hover:ring-1 hover:text-white ring-neutral-500 w-full"
      key={playlist.id}
    >
      <h4 className="text-lg text-left">{playlist.playlistTitle}</h4>
      <div className="text-xs text-right">by {playlist.playlistAuthor}</div>
    </Link>
  ));
};

export const PlaylistLayout: FC<PropsWithChildren> = ({ children }) => {
  const { data: playlists } = trpc.playlist.listLinks.useQuery(
    void 0,
    semiconstantCacheQuery,
  );

  return (
    <div className="sub-grid-layout">
      <div className="flex flex-col items-start max-h-[100vh] min-h-[100vh] pr-[1rem] mr-[-1rem] overflow-x-hidden overflow-y-auto">
        <h3 className="text-md text-slate-600">Playlist Actions</h3>
        <Link
          to="/editor/playlist/new"
          className="text-lg p-1 hover:ring-1 hover:text-white text-left w-full"
        >
          New playlist
        </Link>
        <Link
          to="/editor/playlist/from_file"
          className="text-lg p-1 hover:ring-1 hover:text-white text-left w-full"
        >
          New/Update from file(s)
        </Link>
        <h3 className="text-md text-slate-600 mt-2">Playlist List</h3>
        {playlists && <PlaylistListing playlists={playlists} />}
      </div>
      <div className="max-h-[100vh] min-h-[100vh] pr-[1rem] mr-[-1rem] overflow-x-hidden overflow-y-auto">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
};

export const PlaylistRouting = () => {
  return (
    <PlaylistLayout>
      <Routes>
        <Route path="new" element="new" />
        <Route path="from_file" element={<PlaylistFromFile />} />
        <Route path="list" element={<PlaylistList />} />
        <Route path="list/:playlistId" element={<PlaylistList />} />
      </Routes>
    </PlaylistLayout>
  );
};
