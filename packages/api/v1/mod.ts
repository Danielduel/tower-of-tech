import { db, s3client } from "@/packages/database/mod.ts";
import { buckets } from "@/packages/database/buckets.ts";
import { BeatSaberPlaylistSchema } from "@/packages/types/beatsaber-playlist.ts";
import { makeImageBase64 } from "@/packages/types/brands.ts";

export const apiV1Handler = async (request: Request) => {
  const { pathname } = new URL(request.url);
  const playlistId = pathname.split("/api/v1/")[1];

  const item = await db.BeatSaberPlaylist.findFirst({
    where: {
      id: playlistId
    },
    include: {
      songs: true
    }
  });
  if (!item) return new Response("404", { status: 404 });

  const image = await s3client.getObject(item.id, { bucketName: buckets.playlist.coverImage });
  const data = {
    ...item,
    image: makeImageBase64("base64," + await image.text()),
  } satisfies typeof BeatSaberPlaylistSchema._type;

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "text/bplist",
      }
    },
  );
};
