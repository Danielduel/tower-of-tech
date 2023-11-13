import { buckets } from "@/packages/database/buckets.ts";
import { db, s3client } from "@/packages/database/mod.ts";
import { makeUppercaseMapHash } from "@/packages/types/brands.ts";
import { BeatSaberPlaylistWithoutIdSchema } from "@/packages/types/beatsaber-playlist.ts";
import { decode64 } from "https://deno.land/x/base64to@v0.0.2/mod.ts";

export const createOrUpdatePlaylist = async (input: typeof BeatSaberPlaylistWithoutIdSchema._type) => {
  const playlistId = input.id ?? crypto.randomUUID();

  try {
    await s3client.putObject(playlistId, decode64(input.image.split(",")[1]), {
      bucketName: buckets.playlist.coverImage,
      metadata: {
        "Content-Type": "image/png",
      }
    });
  } catch (err) { console.log(err) }
  try {
    await db.BeatSaberPlaylistSongItem.upsertMany({ data: input.songs })
  } catch (err) { console.log(err) }
  try {
    const a = await db.BeatSaberPlaylist.create({
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
