import "https://deno.land/x/dotenv@v3.2.2/load.ts";

const dirPath = Deno.env.get("PLAYLIST_DIRECTORY");
if (!dirPath) {
  console.error("PLAYLIST_DIRECTORY env is required");
  Deno.exit();
}

const dirListing = [...Deno.readDirSync(dirPath)]
  .filter((item) => item.isFile)
  .filter((item) => item.name.startsWith("ToT - "));
const destinationPath =
  new URL(import.meta.resolve("../../data/playlists")).pathname;

await Promise.all(dirListing.map(async (file) => {
  console.log(`Refreshing ${file.name}`)
  await Deno.copyFile(dirPath + file.name, destinationPath + `/${file.name}`);
}));
