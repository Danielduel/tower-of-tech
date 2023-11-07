import { FC } from "react";
import { WithMaps, WithPlaylist } from "./types.ts";
import { tw } from "@/twind/twind.tsx";
import { trpc } from "@/trpc/trpc.ts";
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

export const Playlist: FC<WithPlaylist> = ({ playlist }) => {
  return (
    <div key={`playlist-${playlist.id}`} className={tw("mb-4")}>
      <div className={tw("text-lg text-left flex flex-row gap-4")}>
        <div>
          <img
            className={tw("w-40 h-40")}
            src={"data:image/png;" + playlist.image}
          />
        </div>
        <div>
          <div key="playlist-Name">Name: {playlist.playlistTitle}</div>
          <div key="playlist-Author">Author: {playlist.playlistAuthor}</div>
          <div key="playlist-Id">Id: {playlist.id}</div>
          <div key="playlist-Maps">Maps: {playlist.songs.length}</div>
        </div>
      </div>
      <div className={tw("mt-2")}>
        <PlaylistMaps maps={playlist.songs} />
      </div>
    </div>
  );
};
