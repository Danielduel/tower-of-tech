import { fromUint8Array } from "https://denopkg.com/chiefbiiko/base64@master/mod.ts";
import { BeatSaberPlaylistFlatSchema, BeatSaberPlaylistSchema } from "@/packages/types/beatsaber-playlist.ts";
import { dbEditor, s3clientEditor } from "@/packages/database-editor/mod.ts";
import { buckets } from "@/packages/database-editor/buckets.ts";
import { makeImageBase64, UppercaseMapHash } from "@/packages/types/brands.ts";
import { towerOfTechWebsiteOrigin } from "@/packages/utils/constants.ts";
import { makePlaylistId, PlaylistId } from "@/packages/types/brands.ts";
import { links } from "@/apps/website/routing.config.ts";
import { makePlaylistUrl } from "@/packages/types/brands.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { getBeatSaberPlaylistSongItemMetadataKey } from "@/packages/database-editor/keys.ts";

export const getImage = async (playlistId: PlaylistId) => {
  const imageBody = await s3clientEditor.getObject(playlistId, {
    bucketName: buckets.playlist.coverImage,
  })
    .then((x) => x.arrayBuffer())
    .then((x) => new Uint8Array(x))
    .then((x) => fromUint8Array(x));

  return makeImageBase64(imageBody);
};

export const playlistIdToCustomData = (playlistId: PlaylistId) => {
  return {
    customData: {
      syncURL: makePlaylistUrl(
        new URL(
          links.api.v1.playlist.data(
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

export const fetchBeatSaberPlaylistWithoutResolvingSongItem = async (
  playlistId: PlaylistId,
) => {
  const _item = (await dbEditor.BeatSaberPlaylist
    .find(playlistId))
    ?.flat();

  if (!_item) return null;
  const item = stripVersionstamps(_item);

  return {
    ...item,
    customData: {
      ...item.customData,
      ...playlistIdToCustomData(playlistId).customData,
    },
  } satisfies Omit<typeof BeatSaberPlaylistFlatSchema._type, "image">;
};

export const fetchBeatSaberPlaylistsWithoutResolvingSongItem = async (
  playlistIds: PlaylistId[],
): Promise<
  Record<PlaylistId, Omit<typeof BeatSaberPlaylistSchema._type, "image">>
> => {
  const responses = await Promise.all(
    playlistIds.map(fetchBeatSaberPlaylistWithoutResolvingSongItem),
  );
  const responseEntries = responses
    .filter(filterNulls)
    .map((response) => ([response.id, response] as const));
  const response = Object.fromEntries(responseEntries);
  return response;
};

export const resolveSongsWithMetaForPlaylist = async (songHashes: UppercaseMapHash[], playlistId: PlaylistId) => {
  const songs = await dbEditor.BeatSaberPlaylistSongItem
    .findMany(songHashes)
    .then((x) => x.map((x) => stripVersionstamps(x.flat())));

  const songsMeta = await dbEditor.BeatSaberPlaylistSongItemMetadata
    .findMany(songHashes.map((mapHash) => getBeatSaberPlaylistSongItemMetadataKey(playlistId, mapHash)))
    .then((x) => x.map((x) => stripVersionstamps(x.flat())));

  return songs.map((songData) => {
    const metadata = songsMeta.find((item) => item.mapHash === songData.hash);
    return {
      ...songData,
      difficulties: metadata?.difficulties ?? [],
    };
  });
};

export const fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem = async (
  playlistId: PlaylistId,
) => {
  const _item = (await dbEditor.BeatSaberPlaylist
    .find(playlistId))
    ?.flat();

  if (!_item) return null;

  const item = stripVersionstamps(_item);
  const songs = await resolveSongsWithMetaForPlaylist(item.songs, playlistId);

  return {
    ...item,
    customData: {
      ...item.customData,
      ...playlistIdToCustomData(playlistId).customData,
    },
    songs,
  } satisfies Omit<typeof BeatSaberPlaylistSchema._type, "image">;
};

export const fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage = async (playlistId: PlaylistId) => {
  const item = await fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem(
    playlistId,
  );
  if (!item) return null;

  const data = {
    ...item,
    image: await getImage(playlistId),
  } satisfies typeof BeatSaberPlaylistSchema._type;

  return data;
};
