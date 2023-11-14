import { FC } from "react";
import { WithMaps, WithPlaylist, WithPlaylistWithImageAsUrl } from "../../../../ui/playlist/types.ts";
import { tw } from "@/packages/twind/twind.tsx";
import { trpc } from "@/packages/trpc/trpc.ts";
import { MapItem } from "../../components/MapItem.tsx";

const PlaylistMaps: FC<WithMaps> = ({ maps }) => {
  const hashes = maps.flatMap((map) => map.hash.toString());
  const { data: resolved } = trpc.map.resolve.useQuery({ hashes }, { staleTime: Infinity });

  return (
    <div className={tw("pl-2 border-l-1 border-black")}>
      {maps.map((map) => (
        <MapItem
          key={map.hash}
          playlistMapItem={map}
          beatSaverMapItem={resolved && resolved[map.hash.toLowerCase()]}
        />
      ))}
    </div>
  );
};

export const Playlist: FC<WithPlaylist | WithPlaylistWithImageAsUrl> = ({ playlist }) => {
  const imageSrc = "imageUrl" in playlist ? playlist.imageUrl : "data:image/png;" + playlist.image;

  return (
    <div key={`playlist-${playlist.id}`} className={tw("mb-4")}>
      <div className={tw("text-lg text-left flex flex-row gap-4")}>
        <div>
          <img
            className={tw("w-40 h-40 min-w-[10rem] min-h-[10rem]")}
            src={imageSrc}
          />
        </div>
        <div>
          <div key="playlist-Name">Name: {playlist.playlistTitle}</div>
          <div key="playlist-Author">Author: {playlist.playlistAuthor}</div>
          <div key="playlist-Id">Id: {playlist.id}</div>
          <div key="playlist-Maps">Maps: {playlist.songs.length}</div>
          <a className={tw("ring-4 ring-blue p-2 float-right")} href={`/api/v1/${playlist.id}`} download>
            Download
          </a>
        </div>
      </div>
      <div className={tw("mt-2")}>
        <PlaylistMaps maps={playlist.songs} />
      </div>
    </div>
  );
};
