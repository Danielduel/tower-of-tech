import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { buckets } from "@/packages/database/buckets.ts";
import { db, s3client } from "@/packages/database/mod.ts";
import { fetchAndCacheHashes } from "@/packages/api-beatsaver/mod.ts";
import { createOrUpdatePlaylist } from "@/packages/trpc/routers/playlist.ts";
import { makeImageBase64, makeLowercaseMapHash } from "@/packages/types/brands.ts";
import { BeatSaberPlaylistWithoutIdSchema, BeatSaberPlaylistSchema } from "@/packages/types/beatsaber-playlist.ts";
import { isReadOnly } from "@/packages/utils/envrionment.ts";

const t = initTRPC.create();

const map = t.router({
  resolve: t.procedure
    .input(z.object({
      hashes: z.array(z.string().transform(makeLowercaseMapHash)),
    }))
    .query(async ({ input: { hashes }}) => {
      return await fetchAndCacheHashes(hashes);
    }),
  list: t.procedure.query(async () => {
    const items = await db.BeatSaberPlaylistSongItem.findMany({});
    return items;
  }),
});

const playlist = t.router({
  list: t.procedure.query(async () => {
    const items = await db.BeatSaberPlaylist.findMany({
      include: {
        songs: true
      }
    });
    return await Promise.all(items.map(async item => {
      const image = await s3client.getObject(item.id, { bucketName: buckets.playlist.coverImage })
      return {
        ...item,
        id: item.id,
        image: makeImageBase64(await image.text()),
      } satisfies typeof BeatSaberPlaylistSchema._type[];
    }));
  }),
  createOrUpdate: t.procedure
    .input(z.array(BeatSaberPlaylistWithoutIdSchema))
    .mutation(async ({ input }) => {
      if (!isReadOnly()) {
        return await Promise.all(input.map(createOrUpdatePlaylist))
      } else {
        throw "Editor is in read-only mode";
      }
  }),
});

export const appRouter = t.router({
  playlist,
  map,
});

export type AppRouter = typeof appRouter;
