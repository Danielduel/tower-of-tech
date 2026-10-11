import { Markdown } from "https://deno.land/x/deno_markdown@v0.2/mod.ts";
import { getToTPlaylistSpeedCategory, getToTPlaylistTechCategory, playlistMapping } from "@/packages/playlist/collections/tower-of-tech/mod.ts";
import { playlists } from "@/src/tools/migratePlaylists.ts";

const mkActions = (path: string, fileName: string, displayName: string) =>
  [
    `<a href="./migrated/playlists-md/${displayName}.md">Details (MD)</a>`,
    `<a href="https://raw.githubusercontent.com/Danielduel/tower-of-tech/main${path}${fileName}" download>Download</a>`,
    `[Raw](https://raw.githubusercontent.com/Danielduel/tower-of-tech/main${path}${fileName})`.replaceAll(" ", "%20"),
  ].join("<br />")
// `[Details](${links.home.playlist.details(playlistId, towerOfTechWebsiteOrigin)}) [Raw](${
//   links.api.v1.playlist.download(playlistId, towerOfTechWebsiteOrigin)
// })`;

const mdImg = (src: string) => `<img src="${src}" height="50px" width="50px" />`;

export const PlaylistsTable = (markdown: Markdown) => {
  markdown
    .table(
      [
        ["", "Name", "Pacing", "Complexity", "Items", ""],
        ...Object
          .entries(playlistMapping)
          .map(([mappingKey, mappingValue]) => {
            const playlist = playlists.find((x) => x.playlist.customData!.id === mappingValue.playlistId);
            if (!playlist) return ``;
            return [
              mdImg(`./migrated/covers/${mappingValue.displayName}.png`),
              playlist.playlist.playlistTitle,
              getToTPlaylistSpeedCategory(mappingValue.speedCategory),
              getToTPlaylistTechCategory(mappingValue.techCategory),
              playlist.playlist.songs.length,
              mkActions(mappingValue.path, mappingValue.fileName, mappingValue.displayName),
            ];
          }),
      ],
    );
  
  return markdown;
};

