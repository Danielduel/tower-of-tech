import { dbEditor, s3clientEditor } from "../../database-editor/mod.ts";
import { buckets } from "../../database-editor/buckets.ts";
import { BeatSaberPlaylistSchema } from "@/packages/types/beatsaber-playlist.ts";
import { makeImageBase64 } from "@/packages/types/brands.ts";

export const apiV1Handler = async (request: Request) => {
  const { pathname } = new URL(request.url);
  const playlistId = pathname.split("/api/v1/")[1];

  const item = await dbEditor.BeatSaberPlaylist.findFirst({
    where: {
      id: playlistId
    },
    include: {
      songs: true
    }
  });
  if (!item) return new Response("404", { status: 404 });

  const image = await s3clientEditor.getObject(item.id, { bucketName: buckets.playlist.coverImage });
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
