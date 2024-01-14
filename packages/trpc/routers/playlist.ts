import { buckets } from "../../database-editor/buckets.ts";
import { dbEditor, s3clientEditor } from "../../database-editor/mod.ts";
import { makeUppercaseMapHash } from "@/packages/types/brands.ts";
import { BeatSaberPlaylistWithoutIdSchema } from "@/packages/types/beatsaber-playlist.ts";
import { decode64 } from "https://deno.land/x/base64to@v0.0.2/mod.ts";
import { ulid } from "https://deno.land/x/ulid@v0.3.0/mod.ts";

export const createOrUpdatePlaylist = async (input: typeof BeatSaberPlaylistWithoutIdSchema._type) => {
  const playlistId = input.id ?? input?.customData?.id ?? ulid();

  try {
    await s3clientEditor.putObject(playlistId, decode64(input.image.split(",")[1]), {
      bucketName: buckets.playlist.coverImage,
      metadata: {
        "Content-Type": "image/png",
      }
    });
  } catch (err) { console.log(err) }
  try {
    await dbEditor.BeatSaberPlaylistSongItem.upsertMany({ data: input.songs })
  } catch (err) { console.log(err) }
  try {
    const a = await dbEditor.BeatSaberPlaylist.create({
      data: {
        ...input,
        image: null,
        id: playlistId,
        songs: input.songs.map(x => makeUppercaseMapHash(x.hash))
      }
    });

    return a;
  } catch (err) { console.error(err) }
}
