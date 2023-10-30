import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { db, s3client } from "@/database/mod.ts";
import { makeImageBase64, makeLowercaseMapHash } from "@/types/brands.ts";
import { fetchAndCacheHashes } from "@/api-beatsaver/mod.ts";
import { BeatSaberPlaylistWithoutIdSchema, BeatSaberPlaylistSchema } from "@/types/beatsaber-playlist.ts";
import { createOrUpdatePlaylist } from "@/trpc/routers/playlist.ts";

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
      const image = await s3client.getObject(item.id, { bucketName: "playlist-cover-image"})
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
      return await Promise.all(input.map(createOrUpdatePlaylist))
  }),
});

export const appRouter = t.router({
  playlist,
  map,
});

export type AppRouter = typeof appRouter;
