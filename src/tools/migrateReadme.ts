import {
  ListTypes,
  Markdown,
} from "https://deno.land/x/deno_markdown@v0.2/mod.ts";
import { playlists } from "@/src/tools/migratePlaylists.ts";
import { playlistMapping } from "@/packages/playlist-mapping/mod.ts";
import { getToTPlaylistSpeedCategory } from "@/packages/playlist-mapping/mod.ts";
import { getToTPlaylistTechCategory } from "@/packages/playlist-mapping/mod.ts";
import { PlaylistId } from "@/packages/types/brands.ts";
import { links } from "@/apps/editor/routing.config.ts";
import { playlistInstallationGuideUrl } from "@/packages/utils/constants.ts";

const markdown = new Markdown();
const mdImg = (src: string) =>
  `<img src="${src}" height="50px" width="50px" />`;
const mkActions = (playlistId: PlaylistId) =>
  `[Details](${
    links.home.playlist.details(playlistId, playlistInstallationGuideUrl)
  }) [OneClick](${
    links.api.v1.playlist.oneClick(playlistId, playlistInstallationGuideUrl)
  }) [Raw](${
    links.api.v1.playlist.download(playlistId, playlistInstallationGuideUrl)
  })`;

await markdown
  .header(`Tower of Tech`, 1)
  .paragraph(
    `This repository contains tech-related playlists and utilities used to manage them.`,
  )
  .header(`Playlists`, 2)
  .paragraph(`
The final (planned, can be changed) state of playlist served by this repository should be like this:
A playlist name should contain prefix and "tech" suffix.
  `)
  .list(
    [
      `Speed prefix could be "Adep", "Acc", "Mid", "Fast" and "Sonic".`,
      `Tech suffix would be "Comfy", "Tech", "Hitech", "Anglehell" and "Tempo".`,
    ],
    ListTypes.UnOrdered,
    "*",
  )
  .paragraph(`There are and will be "guest" playlists - f.e. Morgolf's.`)
  .header(`Current playlist stats`, 3)
  .table(
    [
      ["", "Name", "Pacing", "Complexity", "Items", ""],
      ...Object
        .entries(playlistMapping)
        .map(([mappingKey, mappingValue]) => {
          const playlist = playlists.find((x) =>
            x.playlist.customData!.id === mappingValue.playlistId
          );
          if (!playlist) return ``;
          return [
            mdImg(`./migrated/covers/${mappingValue.displayName}.png`),
            getToTPlaylistSpeedCategory(mappingValue.speedCategory),
            getToTPlaylistTechCategory(mappingValue.techCategory),
            playlist.playlist.playlistTitle,
            playlist.playlist.songs.length,
            mkActions(mappingValue.playlistId),
          ];
        }),
    ],
  )
  .header(`Contributing`, 2)
  .paragraph(`Do you have a great...`)
  .list(
    [
      `...tech playlist and you would love to share it?`,
      `...idea regarding this project?`,
      `...advice to move some map to other category?`,
      `...opinion on something is not actually a tech?`,
    ],
    ListTypes.UnOrdered,
    "*",
  )
  .paragraph(`If first 3: DM me on discord or do an issue on this repository`)
  .paragraph(`What I need now?`)
  .list(
    [
      `More people recommending me maps to try out for categorization`,
      `More people who will be doublechecking categorization`,
    ],
    ListTypes.UnOrdered,
    "*",
  )
  .header(`Thanks!`, 2)
  .paragraph(`People who like to discuss tech`)
  .list(
    [
      `Cush (https://www.twitch.tv/cush_is_me)`,
      `Chrisvenator (https://www.twitch.tv/chrisvenator)`,
      `winter (https://www.twitch.tv/winteredge)`,
      `Goose (https://www.twitch.tv/goosychan)`,
      `DarkyFox (https://www.twitch.tv/darkyfox__)`,
      `i_time (https://www.twitch.tv/i_time)`,
    ],
    ListTypes.UnOrdered,
    "*",
  )
  .paragraph(`People who allowed me to add their playlists to the project`)
  .list(
    [
      `Morgolf (https://www.twitch.tv/morgolf)`,
      `Exa (https://www.twitch.tv/exa_cute)`,
      `HitMeWMusic (https://www.twitch.tv/hitmewmusic)`,
      `Mochichi (https://www.twitch.tv/mochichi72)`,
      `Motzel`,
      `NamakiMono (https://www.twitch.tv/namaki_mono)`,
      `Pleo`,
      `TheHarshJellyfish (https://www.twitch.tv/theharshjellyfish)`,
    ],
    ListTypes.UnOrdered,
    "*",
  )
  .header(`ToT Bot`, 2)
  .paragraph(`Invite link`)
  .paragraph(
    `https://discord.com/api/oauth2/authorize?client_id=1171582001900421192&permissions=17600776047616&scope=bot+applications.commands`,
  )
  .write("./", "README");
