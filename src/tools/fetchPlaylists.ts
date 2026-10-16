import { copy, ensureDir, exists } from "@std/fs";

const envDir = Deno.env.get("BEATSABER_FOLDER_DIR");
if (!envDir) throw "No BEATSABER_FOLDER_DIR";

const envSubDir = Deno.env.get("BEATSABER_FOLDER_SUBDIR");
if (!envSubDir) throw "No BEATSABER_FOLDER_SUBDIR";

const sourceDir = `${envDir}${envSubDir}`
const targetDir = `./data/playlists/`;

const sourceExists = await exists(sourceDir);
const targetExists = await exists(targetDir);

if (!sourceExists) {
  throw "No playlist source"
}

if (!targetExists) {
  await ensureDir(targetDir);
}

await copy(sourceDir, targetDir, { overwrite: true })
