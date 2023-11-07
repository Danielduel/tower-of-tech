import { BeatSaberPlaylistWithoutIdSchema } from "@/types/beatsaber-playlist.ts";
import { db, s3client } from "@/database/mod.ts";
import { makeUppercaseMapHash } from "@/types/brands.ts";

export const createOrUpdatePlaylist = async (input: typeof BeatSaberPlaylistWithoutIdSchema._type) => {
  const playlistId = input.id ?? crypto.randomUUID();

  try {
    await s3client.putObject(playlistId, input.image, {
      bucketName: "playlist-cover-image"
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
