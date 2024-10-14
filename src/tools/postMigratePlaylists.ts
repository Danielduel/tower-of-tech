import { createTrpcClient } from "@/packages/trpc/trpc-editor.ts";
import { playlists } from "@/src/tools/migratePlaylists.ts";
import { migrateBeatSaberPlaylistWithoutIdSchema } from "@/packages/playlist/migrate.ts";

const trpc = createTrpcClient(false);
await Promise.all(playlists.map(async ({
  path,
  coverBase64,
  fileName,
  longName,
  playlist,
  shortName,
}) => {
  const id = playlist.id ?? playlist.customData?.id;
  if (id) console.log(id);
  else return console.log(`No playlist ID`);

  const currentItem = await trpc.playlist.getByIdWithoutResolvingMaps.query({ id });
  const shouldUpdate = currentItem && currentItem.id === id;
  if (!shouldUpdate) return console.log(`Playlist ${id} doesn't exists`);

  console.log(`Migrating ${id}`);
  const migrated = migrateBeatSaberPlaylistWithoutIdSchema(playlist);

  console.log(`Updating ${id}`);
  await trpc.playlist.createOrUpdate.mutate([{ ...migrated, id }]);
}));
