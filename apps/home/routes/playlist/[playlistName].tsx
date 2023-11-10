import { PageProps } from "$fresh/server.ts";
import { Playlist } from "#/playlist/playlist.tsx";
import { readPlaylistFile } from "@/beatsaber-playlist/mod.ts";

const relativePlaylistPath = "../../migrated/playlists";

export default function PlaylistItem(props: PageProps) {
  const playlists = [...Deno.readDirSync(relativePlaylistPath)].map(x => x.name);
  const playlistName = props.params.playlistName.replaceAll("__", " ");
  if (!playlists.includes(playlistName)) return <div>:eyes:</div>
  
  const playlist = readPlaylistFile(`${relativePlaylistPath}/${playlistName}`);

  return <Playlist playlist={playlist} beatSaverMaps={{}} />;
}
