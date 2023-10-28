import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { db } from "@/database/mod.ts";

const posts = [
  { name: "First Post" },
  { name: "Second Post" },
  { name: "Third Post" },
];

const t = initTRPC.create();

const postRouter = t.router({
  get: t.procedure.query(() => posts),
  create: t.procedure
    .input(z.object({ name: z.string() }))
    .mutation(({ input }) => {
      posts.push(input);
      return input;
    }),
});

const playlist = t.router({
  list: t.procedure.query(async () => {
    const items = await db.BeatSaberPlaylist.findMany({});
    return items;
  }),
  create: t.procedure.mutation(async () => {
    const a = await db.BeatSaberPlaylist.create({
      data: {
        id: "sagfuiasui",
        image: "",
        playlistAuthor: "Danielduel",
        playlistTitle: "Test playlist " + Date.now(),
        songs: [],
      }
    });
    return a;

    // const b = await db.BeatSaberPlaylistSongItem.create({
    //   data: {
    //     difficulties: [{
    //       characteristic: "Standard",
    //       name: "ExpertPlus",
    //     }],
    //     hash: "asdasd",
    //     levelAuthorName: "asd",
    //     levelid: "asdasd",
    //     songName: "ASDAAS",
    //     key: "25f",
    //   },
    // });
    // return b;
  }),
});

export const appRouter = t.router({
  hello: t.procedure.query(() => "world"),
  post: postRouter,
  playlist,
});

export type AppRouter = typeof appRouter;
