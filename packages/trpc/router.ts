import { z } from "zod";
import { initTRPC } from "@trpc/server";
import { buckets } from "@/packages/database-editor/buckets.ts";
import { dbEditor, s3clientEditor } from "@/packages/database-editor/mod.ts";
import { isReadOnly } from "@/packages/utils/envrionment.ts";
import { fetchAndCacheFromResolvables, fetchAndCacheFromResolvablesRaw } from "@/packages/api-beatsaver/mod.ts";
import { createOrUpdatePlaylist } from "@/packages/trpc/routers/playlist.ts";
import {
  LowercaseMapHash,
  makeImageUrl,
  makeLowercaseMapHash,
  makePlaylistId,
  PlaylistId,
} from "@/packages/types/brands.ts";
import {
  BeatSaberPlaylistFlatWithImageAsUrlSchema,
  BeatSaberPlaylistWithImageAsUrlSchema,
  BeatSaberPlaylistWithoutIdSchema,
} from "@/packages/types/beatsaber-playlist.ts";
import { BeatSaverResolvableSchema } from "@/packages/api-beatsaver/BeatSaverResolvableSchema.ts";
import {
  fetchBeatSaberPlaylistsWithoutResolvingSongItem,
  fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem,
  fetchBeatSaberPlaylistWithoutResolvingSongItem,
} from "@/packages/database-editor/utils.ts";
import { isDiscordAuthorized } from "@/packages/api/v1/auth/discord.ts";

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
  // list: t.procedure
  //   .query(async () => {
  //     const items = await dbEditor.BeatSaberPlaylistSongItem
  //       .getMany()
  //       .then((x) => x.result)
  //       .then((x) => x.map((y) => y.flat()));
  //     return items;
  //   }),
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
  listByIdWithoutResolvingMaps: t.procedure
    .input(z.object({ ids: z.array(z.string().transform(makePlaylistId)) }))
    .query(async ({
      input: { ids },
    }) => {
      console.log("router call playlist.listByIdWithoutResolvingMaps");

      const items = await fetchBeatSaberPlaylistsWithoutResolvingSongItem(
        ids,
      );
      if (!items) return null;

      const imageUrlEntries = await Promise.all(
        Object.keys(items).map(
          async (key) => [
            key,
            await s3clientEditor.presignedGetObject(key, {
              bucketName: buckets.playlist.coverImage,
            }),
          ],
        ),
      ).then((entries) => entries.map(([key, url]) => [key, makeImageUrl(url)] as const));
      const imageUrls = Object.fromEntries(imageUrlEntries);

      const response = Object.fromEntries(
        Object.keys(items).map((
          key,
        ) => [key, { ...items[key], imageUrl: imageUrls[key] }]),
      );

      return response satisfies Record<
        PlaylistId,
        typeof BeatSaberPlaylistFlatWithImageAsUrlSchema._type
      >;
    }),
  getByIdWithoutResolvingMaps: t.procedure
    .input(z.object({ id: z.string().transform(makePlaylistId) }))
    .query(async ({
      input: { id },
    }) => {
      console.log("router call playlist.getByIdWithoutResolvingMaps");

      const item = await fetchBeatSaberPlaylistWithoutResolvingSongItem(
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
      } satisfies typeof BeatSaberPlaylistFlatWithImageAsUrlSchema._type;
    }),
  getById: t.procedure
    .input(z.object({ id: z.string().transform(makePlaylistId) }))
    .query(async ({
      input: { id },
    }) => {
      console.log("router call playlist.getById");

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

const auth = t.router({
  discord: t.procedure
    .query(async ({ ctx }) => {
      if (!ctx.request) {
        return {
          authorized: false,
        };
      }
      return {
        authorized: await isDiscordAuthorized(ctx.request),
      };
    }),
});

export const appRouter = t.router({
  playlist,
  map,
  auth,
});

export type AppRouter = typeof appRouter;
