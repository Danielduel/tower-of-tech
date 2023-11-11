export const getPlaylistsForRoutes = () => {
  return [...Deno.readDirSync("../../../../migrated/playlists")].map(x => x.name);
}
