import $ from "https://deno.land/x/dax@0.26.0/mod.ts";

const options = [
  "Migrate playlists",
  "Update and migrate playlists",
] as const;
const index = await $.select({
  message: "What's your favourite colour?",
  options: options as unknown as string []
});

switch (options[index]) {
  case "Migrate playlists": 
    await $`deno task migratePlaylists`;
    break;
  case 'Update and migrate playlists':
    await $`deno task refreshPlaylists`;
    await $`deno task migratePlaylists`;
    break;
}
