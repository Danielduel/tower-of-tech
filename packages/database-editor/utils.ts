import { BeatSaberPlaylistSchema } from "@/packages/types/beatsaber-playlist.ts";
import { dbEditor, s3clientEditor } from "@/packages/database-editor/mod.ts";
import { buckets } from "@/packages/database-editor/buckets.ts";
import { makeImageBase64 } from "@/packages/types/brands.ts";
import { towerOfTechWebsiteOrigin } from "@/packages/utils/constants.ts";
import { makePlaylistId, PlaylistId } from "@/packages/types/brands.ts";
import { links } from "@/apps/editor/routing.config.ts";
import { makePlaylistUrl } from "@/packages/types/brands.ts";

export const playlistIdToCustomData = (playlistId: PlaylistId) => {
  return {
    customData: {
      syncURL: makePlaylistUrl(
        new URL(
          links.api.v1.playlist.raw(
            makePlaylistId(playlistId),
            towerOfTechWebsiteOrigin,
          ),
        ).href,
      ),
    },
  };
};

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
  playlistId: PlaylistId,
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
    customData: {
      ...item.customData,
      ...playlistIdToCustomData(playlistId).customData,
    },
    songs,
  } satisfies Omit<typeof BeatSaberPlaylistSchema._type, "image">;
};

export const fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage =
  async (playlistId: PlaylistId) => {
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
