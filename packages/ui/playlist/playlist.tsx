import { MapItem } from "@/packages/ui/playlist/map-item.tsx";
import { WithBeatSaverMaps, WithMaps, WithPlaylist } from "@/packages/ui/playlist/types.ts";

const PlaylistMaps = (
  { maps, beatSaverMaps, prependKey }: WithMaps & WithBeatSaverMaps & {
    prependKey: string;
  },
) => {
  return (
    <div className="pl-2 border-l-1 border-black">
      {maps.map((map) => {
        const beatSaverMapItemHash = map.hash.toLowerCase();
        const beatSaverMapItem = beatSaverMapItemHash in beatSaverMaps ? beatSaverMaps[beatSaverMapItemHash] : null;
        return (
          <MapItem
            key={`${prependKey}-${map.hash}`}
            playlistMapItem={map}
            beatSaverMapItem={beatSaverMapItem}
          />
        );
      })}
    </div>
  );
};

export const Playlist = (
  { playlist, beatSaverMaps, prependKey }: WithPlaylist & WithBeatSaverMaps & {
    prependKey: string;
  },
) => {
  return (
    <div key={`playlist-${playlist.id}`} className="mb-4">
      <div className="text-lg text-left flex flex-row gap-4">
        <div>
          <img
            className="w-40 h-40"
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
      <div className="mt-2">
        <PlaylistMaps
          prependKey={prependKey}
          maps={playlist.songs}
          beatSaverMaps={beatSaverMaps}
        />
      </div>
    </div>
  );
};
