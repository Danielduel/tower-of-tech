import $ from "https://deno.land/x/dax@0.26.0/mod.ts";

const options = [
  "Update playlists",
  "Migrate playlists",
  "Update and migrate playlists",
  "Generate cup of a day playlist",
] as const;
const index = await $.select({
  message: "What to do?",
  options: options as unknown as string []
});

switch (options[index]) {
  case "Update playlists":
    await $`deno task refreshPlaylists`;
    break;
  case "Migrate playlists":
    await $`deno task migratePlaylists`;
    break;
  case 'Update and migrate playlists':
    await $`deno task refreshPlaylists`;
    await $`deno task migratePlaylists`;
    break;
  case "Generate cup of a day playlist":
    await $`deno task generateCupOfADayPlaylist`;
    break;
}
