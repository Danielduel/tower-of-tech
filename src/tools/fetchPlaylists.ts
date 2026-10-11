import { copy, ensureDir, exists } from "@std/fs";

const envDir = Deno.env.get("BEATSABER_FOLDER_DIR");
if (!envDir) throw "No BEATSABER_FOLDER_DIR";

const envSubDir = Deno.env.get("BEATSABER_FOLDER_SUBDIR");
if (!envSubDir) throw "No BEATSABER_FOLDER_SUBDIR";

const sourceDir = `${envDir}${envSubDir}`
const targetDir = `./migrated/dirty`;

const sourceExists = await exists(sourceDir);
const targetExists = await exists(targetDir);

if (!sourceExists) {
  throw "No playlist source"
}

if (!targetExists) {
  await ensureDir("./migrated/playlists/");
}

await copy(sourceDir, "./migrated/playlists/", { overwrite: true })
