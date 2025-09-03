import { fromUint8Array } from "https://denopkg.com/chiefbiiko/base64@master/mod.ts";
import {
  BeatSaberPlaylistFlatSchemaT,
  BeatSaberPlaylistSchema,
  BeatSaberPlaylistSchemaT,
} from "@/packages/types/beatsaber-playlist.ts";
import { DB } from "@tot/db";
import { S3 } from "@tot/s3";
import {
  LowercaseMapHash,
  makeImageBase64,
  makeImageUrl,
  makeLowercaseMapHash,
  UppercaseMapHash,
} from "@/packages/types/brands.ts";
import { BeatLeaderAPIPlayerByIdScoresCompact } from "@/packages/api-beatleader/player/playerByIdScoresCompact.ts";
import { towerOfTechWebsiteOrigin } from "@/packages/utils/constants.ts";
import { makePlaylistId, PlaylistId } from "@/packages/types/brands.ts";
import { links } from "@/apps/website-old/routing.config.ts";
import { makePlaylistUrl } from "@/packages/types/brands.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { fetchAndCacheFromResolvablesRaw } from "@/packages/api-beatsaver/mod.ts";
import { keys } from "@tot/db-schema";

export const getImage = async (playlistId: PlaylistId) => {
  try {
    const s3 = await S3.get();
    const imageBody = await s3.getObject(playlistId, {
      bucketName: S3.buckets.playlist.coverImage,
    })
      .then((x) => x.arrayBuffer())
      .then((x) => new Uint8Array(x))
      .then((x) => fromUint8Array(x));

    return makeImageBase64(imageBody);
  } catch (_) {
    return null;
  }
};

export const getImageUrl = async (playlistId: PlaylistId) => {
  const s3 = await S3.get();
  const imageUrl = await s3.getPresignedUrl("GET", playlistId, {
    bucketName: S3.buckets.playlist.coverImage,
  });

  if (!imageUrl) return null;

  return makeImageUrl(imageUrl);
};

export const playlistListLinks = async () => {
  const db = await DB.get();
  const items = await db.BeatSaberPlaylist
    .getMany()
    .then((x) => x.result)
    .then((x) => x.map((y) => y.flat()));

  const itemsFiltered = items.filter((x) => x.customData?.public);
  return itemsFiltered satisfies BeatSaberPlaylistFlatSchemaT[];
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

export const stripVersionstamps = <T extends Record<string, unknown>>(
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
): Promise<Omit<BeatSaberPlaylistFlatSchemaT, "image"> | null> => {
  const db = await DB.get();
  const _item = (await db.BeatSaberPlaylist
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
  };
};

export const fetchBeatSaberPlaylistsWithoutResolvingSongItem = async (
  playlistIds: PlaylistId[],
): Promise<
  Record<PlaylistId, Omit<BeatSaberPlaylistFlatSchemaT, "image">>
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
  const db = await DB.get();
  const songs = await db.BeatSaberPlaylistSongItem
    .findMany(songHashes)
    .then((x) => x.map((x) => stripVersionstamps(x.flat())));

  const songsMeta = await db.BeatSaberPlaylistSongItemMetadata
    .findMany(songHashes.map((mapHash) => keys.getBeatSaberPlaylistSongItemMetadataKey(playlistId, mapHash)))
    .then((x) => x.map((x) => stripVersionstamps(x.flat())));

  const beatsaverItemsMetadata = (await fetchAndCacheFromResolvablesRaw(
    (songHashes.map(makeLowercaseMapHash)).map((hash) => ({
      kind: "hash",
      data: hash,
      diffs: [],
    })),
  )).fromHashes;

  return songs.map((songData) => {
    const metadata = songsMeta.find((item) => item.mapHash === songData.hash);
    const beatsaverItemMetadata = beatsaverItemsMetadata[makeLowercaseMapHash(songData.hash)];
    // console.log({ metadata, songData, beatsaverItemMetadata });
    return {
      ...songData,
      key: beatsaverItemMetadata?.id ?? undefined,
      difficulties: metadata?.difficulties ?? [],
      coverUrl: beatsaverItemMetadata?.versions[0].coverURL,
    };
  });
};

export type fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemT = Omit<BeatSaberPlaylistSchemaT, "image">;
export const fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem = async (
  playlistId: PlaylistId,
) => {
  const db = await DB.get();
  const _item = (await db.BeatSaberPlaylist
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
  } satisfies Omit<BeatSaberPlaylistSchemaT, "image">;
};

export type fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImageT = BeatSaberPlaylistSchemaT;
export const fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndImage = async (playlistId: PlaylistId) => {
  const item = await fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem(
    playlistId,
  );
  if (!item) return null;

  const data = {
    ...item,
    image: await getImage(playlistId),
  } satisfies BeatSaberPlaylistSchemaT;

  return data;
};

export const _fetchBeatLeaderScoresForPlayerIdFileteredByPlaylist = async (
  beatleaderPlayerId: string,
  playlist: fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemT,
  count: number,
  page: number,
) => {
  const playerDataR = await fetch(
    `https://api.beatleader.xyz/player/${beatleaderPlayerId}/scores/compact?count=${count}&page=${page}`,
    {
      body: JSON.stringify([playlist]),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    },
  );
  const _playerData = await playerDataR.json();
  const playerData = await BeatLeaderAPIPlayerByIdScoresCompact.GET.SuccessSchema.parseAsync(_playerData);

  return playerData;
};

export const fetchBeatLeaderScoresForPlayerIdFilteredByPlaylist = async (
  beatleaderPlayerId: string,
  playlist: fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemT,
): Promise<BeatLeaderAPIPlayerByIdScoresCompact.GET.ItemT[]> => {
  const returns: BeatLeaderAPIPlayerByIdScoresCompact.GET.ItemT[] = [];
  let response = await _fetchBeatLeaderScoresForPlayerIdFileteredByPlaylist(beatleaderPlayerId, playlist, 100, 1);
  returns.push(...response.data);
  while (response.metadata.page * response.metadata.itemsPerPage < response.metadata.total) {
    console.log(response.metadata);
    response = await _fetchBeatLeaderScoresForPlayerIdFileteredByPlaylist(beatleaderPlayerId, playlist, 100, response.metadata.page + 1);
    returns.push(...response.data);
  }
  console.log(response.metadata);

  return returns;
}

export const fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndBeatLeaderScoresForPlayerId = async (
  playlistId: PlaylistId,
  beatleaderPlayerId: string,
) => {
  const data = await fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItem(
    playlistId,
  );
  if (!data) throw 404;

  const imageUrl = await getImageUrl(playlistId);
  const beatLeaderCompactScores = await fetchBeatLeaderScoresForPlayerIdFilteredByPlaylist(beatleaderPlayerId, data);

  return {
    playlist: data,
    beatLeaderCompactScores,
    imageUrl,
  };
};
export type fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndBeatLeaderScoresForPlayerIdT = Awaited<
  ReturnType<typeof fetchBeatSaberPlaylistWithBeatSaberPlaylistSongItemAndBeatLeaderScoresForPlayerId>
>;
