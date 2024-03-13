import { s3clientEditor } from "@/packages/database-editor/mod.ts";
import { buckets } from "@/packages/database-editor/buckets.ts";
import { BeatSaberPlaylistSchema } from "@/packages/types/beatsaber-playlist.ts";
import { makeImageBase64 } from "@/packages/types/brands.ts";
import { fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem } from "@/packages/database-editor/utils.ts";

export const apiV1Handler = async (request: Request) => {
  const { pathname } = new URL(request.url);
  const __playlistId = pathname.split("/api/v1/playlist/get/")[1];
  const _playlistId = __playlistId.split(".bplist")[0];
  const playlistId = _playlistId.split(".json")[0];

  const item = await fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem(
    playlistId,
  );
  if (!item) return new Response("404", { status: 404 });

  const image = await s3clientEditor.getObject(item.id, {
    bucketName: buckets.playlist.coverImage,
  });
  const data = {
    ...item,
    image: makeImageBase64("base64," + await image.text()),
  } satisfies typeof BeatSaberPlaylistSchema._type;

  return new Response(
    JSON.stringify(data),
    {
      headers: {
        "Content-Type": "text/bplist",
        "Content-Disposition":
          `attachment; filename="${data.playlistTitle} by ${data.playlistAuthor}.bplist"`,
      },
    },
  );
};
