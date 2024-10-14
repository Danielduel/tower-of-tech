// import { compress } from "../../../deno-zip/mod.ts";
import { getCoverBase64 } from "@/src/utils/cover-image.ts";
import { stringifyPlaylist } from "@/src/utils/json.ts";
import { ulid } from "https://deno.land/x/ulid@v0.3.0/mod.ts";
import { links } from "@/apps/website/routing.config.ts";
import { towerOfTechWebsiteOrigin } from "@/packages/utils/constants.ts";
import { makeImageBase64, makePlaylistId, makePlaylistUrl } from "@/packages/types/brands.ts";
import {
  // BlobWriter,
  // HttpReader,
  TextReader,
  Uint8ArrayWriter,
  ZipWriter,
} from "https://unpkg.com/@zip.js/zip.js@2.7.48/index.js";
import { removePlaylistItemDuplicates } from "@/packages/playlist/migrate.ts";
import {
  BeatSaberPlaylistWithoutIdSchema,
  BeatSaberPlaylistWithoutIdSchemaT,
} from "@/packages/types/beatsaber-playlist.ts";
import { createTrpcClient } from "@/packages/trpc/trpc-editor.ts";
import { migrateBeatSaberPlaylistWithoutIdSchema } from "@/packages/playlist/migrate.ts";

const coverPath = new URL(import.meta.resolve("../../migrated/covers")).pathname;

const sourcePath = new URL(import.meta.resolve("../../data/playlists")).pathname;
const destinationPath = new URL(import.meta.resolve("../../migrated/playlists")).pathname;
const destinationPathOffline = new URL(import.meta.resolve("../../migrated/playlists-offline")).pathname;

const sourcePathGuests = new URL(import.meta.resolve("../../data/playlists-guest")).pathname;
const destinationPathGuests = new URL(import.meta.resolve("../../migrated/playlists-guest")).pathname;
const destinationPathOfflineGuests = new URL(import.meta.resolve("../../migrated/playlists-guest-offline"))
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

const readPlaylistFile = (path: string): BeatSaberPlaylistWithoutIdSchemaT => {
  return BeatSaberPlaylistWithoutIdSchema.parse(JSON.parse(Deno.readTextFileSync(path)));
};

const migratePlaylist = async (
  fileName: string,
  playlist: BeatSaberPlaylistWithoutIdSchemaT,
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
    coverBase64: makeImageBase64(await getCoverBase64(shortName)),
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

type CompressFiles = {
  localPath: string;
  archivePath: string;
  jsonData: string;
  jsonDataOffline: string;
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
    const beatsaberPlaylistOffline = {
      image: makeImageBase64(coverBase64),
      playlistAuthor: playlist.playlistAuthor,
      playlistTitle: playlist.playlistTitle,
      songs: removePlaylistItemDuplicates(playlist.songs),
      customData: {
        id: playlist?.customData?.id ?? ulid(),
      },
    } satisfies BeatSaberPlaylistWithoutIdSchemaT;
    const beatsaberPlaylist: BeatSaberPlaylistWithoutIdSchemaT = {
      ...beatsaberPlaylistOffline,
      customData: {
        AllowDuplicates: false,
        id: beatsaberPlaylistOffline.customData?.id,
        owner: "Danielduel",
        // `https://raw.githubusercontent.com/Danielduel/tower-of-tech/main/migrated/playlists${path}${fileName}`
        syncURL: makePlaylistUrl(
          new URL(
            links.api.v1.playlist.download(
              makePlaylistId(beatsaberPlaylistOffline.customData.id),
              towerOfTechWebsiteOrigin,
            ),
          ).href,
        ),
      },
    };
    const beatsaberPlaylistOfflineString = stringifyPlaylist(
      beatsaberPlaylistOffline,
    );
    const beatsaberPlaylistString = stringifyPlaylist(beatsaberPlaylist);
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
      jsonData: beatsaberPlaylistString,
      jsonDataOffline: beatsaberPlaylistOfflineString,
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

    const beatsaberPlaylistOffline: BeatSaberPlaylistWithoutIdSchemaT = {
      image: coverBase64,
      playlistAuthor: playlist.playlistAuthor,
      playlistTitle: playlist.playlistTitle,
      songs: removePlaylistItemDuplicates(playlist.songs),
      customData: {
        id: playlist?.customData?.id ?? ulid(),
      },
    };
    const beatsaberPlaylist: BeatSaberPlaylistWithoutIdSchemaT = {
      ...beatsaberPlaylistOffline,
      customData: {
        AllowDuplicates: false,
        id: beatsaberPlaylistOffline.customData?.id,
        owner: "Danielduel",
        syncURL: makePlaylistUrl(
          new URL(
            `https://raw.githubusercontent.com/Danielduel/tower-of-tech/main/migrated/playlists-guest${path}${fileName}`,
          ).href,
        ),
      },
    };
    const beatsaberPlaylistOfflineString = stringifyPlaylist(
      beatsaberPlaylistOffline,
    );
    const beatsaberPlaylistString = stringifyPlaylist(beatsaberPlaylist);
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
      jsonData: beatsaberPlaylistString,
      jsonDataOffline: beatsaberPlaylistOfflineString,
    });
  })),
]);

const tempDir = "./tree/";
await Deno.remove(tempDir, { recursive: true });
await Deno.mkdir(tempDir, { recursive: true });
await Promise.all(compressFiles.map(async (task) => {
  await Deno.mkdir(tempDir + task.archivePath, { recursive: true });
  await Deno.remove(tempDir + task.archivePath, { recursive: true });
  await Deno.copyFile(task.localPath, tempDir + task.archivePath);
}));

const createPlaylistPack = async (files: CompressFiles[]) => {
  const zipWriter = new ZipWriter(new Uint8ArrayWriter());
  await Promise.all(files.map((file) => {
    return zipWriter.add(file.archivePath, new TextReader(file.jsonData));
  }));
  return zipWriter.close();
};

const pack = await createPlaylistPack(compressFiles);
Deno.writeFileSync("./tree/ToT.zip", pack);

export { playlists };
