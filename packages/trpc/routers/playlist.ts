import { ulid } from "https://deno.land/x/ulid@v0.3.0/mod.ts";
import { decode64 } from "https://deno.land/x/base64to@v0.0.2/mod.ts";
import { buckets } from "@/packages/database-editor/buckets.ts";
import { makeUppercaseMapHash } from "@/packages/types/brands.ts";
import { dbEditor, s3clientEditor } from "@/packages/database-editor/mod.ts";
import { BeatSaberPlaylistWithoutIdSchema } from "@/packages/types/beatsaber-playlist.ts";
import { getBeatSaberPlaylistSongItemMetadataKey } from "@/packages/database-editor/keys.ts";

export const createOrUpdatePlaylist = async (
  input: typeof BeatSaberPlaylistWithoutIdSchema._type,
) => {
  const playlistId = input.id ?? input?.customData?.id ?? ulid();

  try {
    console.log(`Upload cover image for ${playlistId} (start)`);
    await s3clientEditor.putObject(
      playlistId,
      decode64(input.image.split(",")[1]),
      {
        bucketName: buckets.playlist.coverImage,
        metadata: {
          "Content-Type": "image/png",
        },
      },
    );
    console.log(`Upload cover image for ${playlistId} (finish)`);
  } catch (err) {
    console.log(err);
  }
  try {
    console.log(
      `Adding songs (${input.songs.length}) for ${playlistId} (start)`,
    );
    await dbEditor.BeatSaberPlaylistSongItem.addMany(input.songs);
    console.log(
      `Adding songs (${input.songs.length}) for ${playlistId} (finish)`,
    );
  } catch (err) {
    console.log(err);
  }
  try {
    console.log(
      `Adding song metadata (${input.songs.length}) for ${playlistId} (start)`,
    );
    await dbEditor.BeatSaberPlaylistSongItemMetadata.addMany(input.songs.map((mapData) => ({
      id: getBeatSaberPlaylistSongItemMetadataKey(playlistId, mapData.hash),
      mapHash: mapData.hash,
      playlistId,
      difficulties: mapData.difficulties,
    })));
    console.log(
      `Adding song metadata (${input.songs.length}) for ${playlistId} (finish)`,
    );
  } catch (err) {
    console.log(err);
  }
  try {
    console.log(`Adding playlist ${playlistId}`);
    return await dbEditor.BeatSaberPlaylist.upsert({
      id: playlistId,
      set: {
        ...input,
        image: null,
        id: playlistId,
        songs: [
          ...new Set(input.songs.map((x) => makeUppercaseMapHash(x.hash))),
        ],
      },
      update: {
        ...input,
        image: null,
        id: playlistId,
        songs: [
          ...new Set(input.songs.map((x) => makeUppercaseMapHash(x.hash))),
        ],
      },
    }, {
      strategy: "replace",
    });
  } catch (err) {
    console.error(err);
  }
};
