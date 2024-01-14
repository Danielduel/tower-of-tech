// import { compress } from "../../../deno-zip/mod.ts";
import type {
  BeatSaberPlaylist,
  BeatSaberPlaylistSongItem,
  BeatSaberPlaylistSongItemDifficulty,
} from "../types/BeatSaberPlaylist.d.ts";
import { getCoverBase64 } from "../utils/cover-image.ts";
import { stringify } from "../utils/json.ts";
import { ulid } from "https://deno.land/x/ulid@v0.3.0/mod.ts";

const coverPath =
  new URL(import.meta.resolve("../../migrated/covers")).pathname;

const sourcePath =
  new URL(import.meta.resolve("../../data/playlists")).pathname;
const destinationPath =
  new URL(import.meta.resolve("../../migrated/playlists")).pathname;
const destinationPathOffline =
  new URL(import.meta.resolve("../../migrated/playlists-offline")).pathname;

const sourcePathGuests =
  new URL(import.meta.resolve("../../data/playlists-guest")).pathname;
const destinationPathGuests =
  new URL(import.meta.resolve("../../migrated/playlists-guest")).pathname;
const destinationPathOfflineGuests =
  new URL(import.meta.resolve("../../migrated/playlists-guest-offline"))
    .pathname;

await Promise.all([
  Deno.mkdir(coverPath, { recursive: true }),
  Deno.mkdir(destinationPath, { recursive: true }),
  Deno.mkdir(destinationPathOffline, { recursive: true }),
  Deno.mkdir(destinationPathGuests, { recursive: true }),
  Deno.mkdir(destinationPathOfflineGuests, { recursive: true }),
]);

const dirListing = [...Deno.readDirSync(sourcePath)]
  .filter((item) => item.isFile);
const dirListingGuests = [...Deno.readDirSync(sourcePathGuests)]
  .filter((item) => item.isDirectory)
  .flatMap((guestNameDir) =>
    [...Deno.readDirSync(`${sourcePathGuests}/${guestNameDir.name}`)]
      .filter((item) => item.isFile)
      .map((item) => [guestNameDir.name, item] as const)
  );

const readPlaylistFile = (path: string): BeatSaberPlaylist => {
  return JSON.parse(Deno.readTextFileSync(path));
};

const migratePlaylist = async (
  fileName: string,
  playlist: BeatSaberPlaylist,
  path: string,
) => {
  const longName = fileName
    .split(".bplist")[0];
  const shortName = longName
    .split("ToT - ")
    .pop()!;

  return {
    path,
    fileName,
    longName,
    shortName,
    playlist,
    coverBase64: await getCoverBase64(shortName),
  };
};

const [playlists, guestPlaylists] = await Promise.all([
  Promise.all(
    dirListing.map((file) =>
      migratePlaylist(
        file.name,
        readPlaylistFile(`${sourcePath}/${file.name}`),
        "/",
      )
    ),
  ),
  Promise.all(
    dirListingGuests.map(([dir, file]) =>
      migratePlaylist(
        file.name,
        readPlaylistFile(`${sourcePathGuests}/${dir}/${file.name}`),
        `/${dir}/`,
      )
    ),
  ),
]);
const mergedMaps = playlists.flatMap((playlist) => playlist.playlist.songs);

const playlistItems: Record<string, BeatSaberPlaylistSongItem[]> = {};
mergedMaps.forEach((item) => {
  if (!playlistItems[item.hash]) playlistItems[item.hash] = [];

  playlistItems[item.hash].push(item);
});

Object
  .entries(playlistItems)
  .filter(([_, arr]) => arr.length > 1)
  .forEach(([key, arr]) => {
    const mergedStringDiffs = arr
      .flatMap((item) => item.difficulties)
      .map((diff) => `${diff.characteristic}:${diff.name}`);
    const difficulties = [...new Set(mergedStringDiffs)].map((stringDiff) => {
      const [characteristic, name] = stringDiff.split(":");
      return { characteristic, name } as BeatSaberPlaylistSongItemDifficulty;
    });
    playlistItems[key] = [{ ...arr[0], difficulties }];
  });

const hardcodedMergedPlaylistId = "c73e5bf9-bb91-450c-913a-4b52d504444b";
const allMaps = Object.values(playlistItems).flatMap((x) => x);
playlists.push(
  await migratePlaylist("ToT - *.bplist", {
    image: "",
    playlistAuthor: "Danielduel",
    playlistTitle: "ToT - *",
    songs: allMaps,
    customData: {
      id: hardcodedMergedPlaylistId
    }
  }, "/"),
);

type CompressFiles = {
  localPath: string;
  archivePath: string;
};
const compressFiles: CompressFiles[] = [];

await Promise.all([
  Promise.all(playlists.map(async ({
    path,
    coverBase64,
    fileName,
    longName,
    playlist,
    shortName,
  }) => {
    if (playlist?.customData?.id?.includes(" ")) {
      delete playlist?.customData?.id;
    }
    const beatsaberPlaylistOffline: BeatSaberPlaylist = {
      image: coverBase64,
      playlistAuthor: playlist.playlistAuthor,
      playlistTitle: playlist.playlistTitle,
      songs: playlist.songs,
      customData: {
        id: playlist?.customData?.id ?? ulid()
      }
    };
    const beatsaberPlaylist: BeatSaberPlaylist = {
      ...beatsaberPlaylistOffline,
      customData: {
        AllowDuplicates: false,
        id: beatsaberPlaylistOffline.customData?.id,
        owner: "Danielduel",
        syncURL:
          new URL(
            `https://raw.githubusercontent.com/Danielduel/tower-of-tech/main/migrated/playlists${path}${fileName}`,
          ).href,
      },
    };
    const beatsaberPlaylistOfflineString = stringify(beatsaberPlaylistOffline);
    const beatsaberPlaylistString = stringify(beatsaberPlaylist);
    await Deno.writeTextFile(
      `${destinationPathOffline}${path}${fileName}`,
      beatsaberPlaylistOfflineString,
    );
    await Deno.writeTextFile(
      `${destinationPath}${path}${fileName}`,
      beatsaberPlaylistString,
    );
    compressFiles.push({
      localPath: `${destinationPath}${path}${fileName}`,
      archivePath: `Playlists/ToT${path}${fileName}`,
    });
  })),
  Promise.all(guestPlaylists.map(async ({
    path,
    coverBase64,
    fileName,
    longName,
    playlist,
    shortName,
  }) => {
    if (playlist?.customData?.id?.includes(" ")) {
      delete playlist?.customData?.id;
    }

    const beatsaberPlaylistOffline: BeatSaberPlaylist = {
      image: coverBase64,
      playlistAuthor: playlist.playlistAuthor,
      playlistTitle: playlist.playlistTitle,
      songs: playlist.songs,
      customData: {
        id: playlist?.customData?.id ?? ulid()
      }
    };
    const beatsaberPlaylist: BeatSaberPlaylist = {
      ...beatsaberPlaylistOffline,
      customData: {
        AllowDuplicates: false,
        id: beatsaberPlaylistOffline.customData?.id,
        owner: "Danielduel",
        syncURL:
          new URL(
            `https://raw.githubusercontent.com/Danielduel/tower-of-tech/main/migrated/playlists-guest${path}${fileName}`,
          ).href,
      },
    };
    const beatsaberPlaylistOfflineString = stringify(beatsaberPlaylistOffline);
    const beatsaberPlaylistString = stringify(beatsaberPlaylist);
    await Deno.mkdir(destinationPathOfflineGuests + path, { recursive: true });
    await Deno.mkdir(destinationPathGuests + path, { recursive: true });
    await Deno.writeTextFile(
      `${destinationPathOfflineGuests}${path}${fileName}`,
      beatsaberPlaylistOfflineString,
    );
    await Deno.writeTextFile(
      `${destinationPathGuests}${path}${fileName}`,
      beatsaberPlaylistString,
    );
    compressFiles.push({
      localPath: `${destinationPathGuests}${path}${fileName}`,
      archivePath: `Playlists/ToT Guest${path}${fileName}`,
    });
  })),
]);

const tempDir = "./tree/";
await Deno.remove(tempDir, { recursive: true });
await Deno.mkdir(tempDir, { recursive: true });
await Promise.all(compressFiles.map(async task => {
  await Deno.mkdir(tempDir + task.archivePath, { recursive: true });
  await Deno.remove(tempDir + task.archivePath, { recursive: true });
  await Deno.copyFile(task.localPath, tempDir + task.archivePath);
}))

// compress(
//   compressFiles,
//   "archive.zip",
// );
