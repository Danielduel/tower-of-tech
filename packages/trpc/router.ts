import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { buckets } from "@/packages/database-editor/buckets.ts";
import { dbEditor, s3clientEditor } from "@/packages/database-editor/mod.ts";
import { isReadOnly } from "@/packages/utils/envrionment.ts";
import {
  fetchAndCacheFromResolvables,
  fetchAndCacheFromResolvablesRaw,
} from "@/packages/api-beatsaver/mod.ts";
import { createOrUpdatePlaylist } from "@/packages/trpc/routers/playlist.ts";
import {
  LowercaseMapHash,
  makeImageUrl,
  makeLowercaseMapHash,
} from "@/packages/types/brands.ts";
import {
  BeatSaberPlaylistWithImageAsUrlSchema,
  BeatSaberPlaylistWithoutIdSchema,
} from "@/packages/types/beatsaber-playlist.ts";
import { BeatSaverResolvableSchema } from "@/packages/api-beatsaver/BeatSaverResolvableSchema.ts";
import { fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem } from "@/packages/database-editor/utils.ts";

const t = initTRPC.create();

const map = t.router({
  resolve: t.procedure
    .input(z.object({
      hashes: z.array(z.string().transform(makeLowercaseMapHash)),
    }))
    .query(async ({ input: { hashes } }) => {
      return (await fetchAndCacheFromResolvablesRaw(
        (hashes as LowercaseMapHash[]).map((hash) => ({
          kind: "hash",
          data: hash,
        })),
      )).fromHashes;
    }),
  list: t.procedure.query(async () => {
    const items = await dbEditor.BeatSaberPlaylistSongItem
      .getMany()
      .then((x) => x.result)
      .then((x) => x.map((y) => y.flat()));
    return items;
  }),
  fromBeatSaverResolvables: t.procedure
    .input(
      z.object({ beatSaverResolvables: z.array(BeatSaverResolvableSchema) }),
    )
    .query(async ({ input: { beatSaverResolvables } }) => {
      return await fetchAndCacheFromResolvables(beatSaverResolvables);
    }),
});

const playlist = t.router({
  listLinks: t.procedure.query(async () => {
    const items = await dbEditor.BeatSaberPlaylist
      .getMany()
      .then((x) => x.result)
      .then((x) => x.map((y) => y.flat()));
    return items;
  }),
  getById: t.procedure
    .input(z.object({ id: z.string() }))
    .query(async ({
      input: { id },
    }) => {
      const item = await fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem(
        id,
      );
      if (!item) return null;

      const imageUrl = makeImageUrl(
        await s3clientEditor.presignedGetObject(item.id, {
          bucketName: buckets.playlist.coverImage,
        }),
      );
      return {
        ...item,
        imageUrl,
      } satisfies typeof BeatSaberPlaylistWithImageAsUrlSchema._type;
    }),
  createOrUpdate: t.procedure
    .input(z.array(BeatSaberPlaylistWithoutIdSchema))
    .mutation(async ({ input }) => {
      if (!isReadOnly()) {
        return await Promise.all(input.map(createOrUpdatePlaylist));
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
