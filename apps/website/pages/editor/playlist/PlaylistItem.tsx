import { FC, useMemo } from "react";
import {
  WithMaps,
  WithPlaylist,
  WithPlaylistWithImageAsUrl,
} from "@/packages/ui/playlist/types.ts";
import { trpc } from "@/packages/trpc/trpc-react.ts";
import { MapItem } from "@/apps/editor/components/MapItem.tsx";
import { Image } from "@/apps/editor/components/Image.tsx";
import { links } from "@/apps/editor/routing.config.ts";
import { semiconstantCacheQuery } from "@/packages/react-query/constants.ts";

export const PlaylistMaps: FC<WithMaps & { prependKey: string }> = (
  { maps, prependKey },
) => {
  const hashes = useMemo(() => maps.flatMap((map) => map.hash.toString()), [
    maps,
  ]);
  const { data: resolved } = trpc.map.resolve.useQuery(
    { hashes },
    semiconstantCacheQuery,
  );

  return (
    <div className="mx-1 border-l-1 border-black">
      {maps.map((map) => (
        <MapItem
          key={`${prependKey}-${map.hash}`}
          playlistMapItem={map}
          beatSaverMapItem={resolved && resolved[map.hash.toLowerCase()]}
        />
      ))}
    </div>
  );
};

export const Playlist: FC<
  (WithPlaylist | WithPlaylistWithImageAsUrl) & { prependKey: string }
> = (
  { playlist, prependKey },
) => {
  const imageSrc = "imageUrl" in playlist
    ? playlist.imageUrl
    : "data:image/png;" + playlist.image;

  return (
    <div key={`playlist-${playlist.id}`} className="mb-4">
      <div className="text-lg text-left flex flex-row gap-4 glass mx-1 p-2">
        <div className="w-80 h-80 min-w-[10rem] min-h-[10rem]">
          <Image
            className="w-80 h-80 min-w-[10rem] min-h-[10rem] rounded-3xl"
            width={320}
            height={320}
            src={imageSrc}
          />
        </div>
        <div className="ml-4 mt-4">
          <div key="playlist-Name">
            <div className="text-xs text-slate-600">Name</div>
            <div className="text-lg leading-3 mb-2">
              {playlist.playlistTitle}
            </div>
          </div>
          <div key="playlist-Author">
            <div className="text-xs text-slate-600">Author</div>
            <div className="text-lg leading-3 mb-2">
              {playlist.playlistAuthor}
            </div>
          </div>
          <div key="playlist-Id">
            <div className="text-xs text-slate-600">Id</div>
            <div className="text-lg leading-3 mb-2">
              {playlist.id}
            </div>
          </div>
          <div key="playlist-Maps">
            <div className="text-xs text-slate-600">Content</div>
            <div className="text-lg leading-3 mb-2">
              {playlist.songs.length} items
            </div>
          </div>
          <a
            className="ring-4 ring-blue p-2 float-right"
            href={links.api.v1.playlist.download(playlist.id)}
            download
          >
            Download
          </a>
        </div>
      </div>
      <div className="mt-2">
        <PlaylistMaps prependKey={prependKey} maps={playlist.songs} />
      </div>
    </div>
  );
};
