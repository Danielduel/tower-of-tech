import { BeatSaberPlaylistSchema } from "@/packages/types/beatsaber-playlist.ts";
import { dbEditor, s3clientEditor } from "@/packages/database-editor/mod.ts";
import { buckets } from "@/packages/database-editor/buckets.ts";
import { makeImageBase64 } from "@/packages/types/brands.ts";

const stripVersionstamps = <T extends Record<string, unknown>>(
  x: T,
): "versionstamp" extends keyof T ? Omit<T, "versionstamp"> : T => {
  if ("versionstamp" in x) {
    delete x["versionstamp"];
    return x;
  }
  return x;
};

export const fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem = async (
  playlistId: string,
) => {
  const _item = (await dbEditor.BeatSaberPlaylist
    .find(playlistId))
    ?.flat();

  if (!_item) return null;
  const item = stripVersionstamps(_item);

  const songs = await dbEditor.BeatSaberPlaylistSongItem
    .findMany(item.songs)
    .then((x) => x.map((x) => stripVersionstamps(x.flat())));

  return {
    ...item,
    songs,
  } satisfies Omit<typeof BeatSaberPlaylistSchema._type, "image">;
};

export const fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage =
  async (playlistId: string) => {
    const item = await fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem(
      playlistId,
    );
    if (!item) return null;

    const image = await s3clientEditor.getObject(item.id, {
      bucketName: buckets.playlist.coverImage,
    });
    const data = {
      ...item,
      image: makeImageBase64("base64," + await image.text()),
    } satisfies typeof BeatSaberPlaylistSchema._type;

    return data;
  };
