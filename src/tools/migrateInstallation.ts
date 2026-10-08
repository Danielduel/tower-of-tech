import { ListTypes, Markdown } from "https://deno.land/x/deno_markdown@v0.2/mod.ts";
import { kofi } from "@/src/tools/mdUtil.ts";
import { latestPlaylistReleaseUrl } from "@/packages/utils/constants.ts";

const getTheZip = `\
1. Go to [the latest Releases page](https://github.com/Danielduel/tower-of-tech/releases/latest).
2. In the dropdown called "Assets" find a file called "ToT.zip". (the url of it is ${latestPlaylistReleaseUrl})
3. Go to your Downloads folder and locate the "ToT.zip", cut it.
`;

const markdown = new Markdown();
const _markdownContent = markdown
  .paragraph(kofi)
  .header(`Tower of Tech`, 1)
  .header("Installation", 1)
  .paragraph(`\
Note:

This guide is in development and I want your feedback about it.
Here is [a discord link to contact me](https://discord.gg/nuNzrpbJ7C)

These playlists have nothing special to them that makes them pcvr-only.
Instructions are for PCVR because this is the one that I can test and I need help with developing this guide.
Please help me with this guide.

Current help needed:

* Standalone guide
* How to locate beat saber folder in the meta store
`)
  .list([
    "[PCVR](#installation-pcvr)",
    "Standalone" // "[Standalone](#Standalone)"
  ], ListTypes.UnOrdered)
  .header("PCVR {#installation-pcvr}", 2)
  .list([
    "[BSManager](#installation-pcvr-bsmanager) (recommended)",
    "[Manual](#installation-pcvr-manual)"
  ], ListTypes.UnOrdered)
  

  // PCVR BSManager
  .header("BSManager {#installation-pcvr-bsmanager}", 3)
  .list([
    "[Requirements](#installation-pcvr-bsmanager-requirements)",
    "[Get the zip](#installation-pcvr-bsmanager-get-the-zip)",
    "[Import playlists into BSManager](#installation-pcvr-bsmanager-import-playlists-into-bsmanager)",
    "[Run the game](#installation-pcvr-bsmanager-run-the-game)"
  ])
  .header("Requirements {#installation-pcvr-bsmanager-requirements}", 4)
  .paragraph(`\
BSManager will do this step for you, you can skip it.

You need Playlist mod - PlaylistManger.
You can get it via:

* [BSManager](https://www.bsmanager.io/)
* [ModAssistant](https://github.com/Assistant/ModAssistant/releases/tag/v1.1.32)
* [BeatMods](https://beatmods.com/mods/170)
* [GitHub](https://github.com/rithik-b/PlaylistManager#download)
`)
  .header("Get the zip {#installation-pcvr-bsmanager-get-the-zip}", 4)
  .paragraph(getTheZip)
  .header("Import playlists into BSManager {#installation-pcvr-bsmanager-import-playlists-into-bsmanager}", 4)
  .paragraph(`\
First - unpack the zip somewhere easy to access.

1. Choose your Beat Saber version on the left.
2. Go to the "Maps" tab on the top.
3. Go to the "Playlists" subtab (vertical tabs on the left).
4. On the top press the "+Add" button.
5. The dropdown should appear, choose "Import playlists".
6. Drag&Drop unpacked files from ToT.zip or click browse and select them.
7. If BSManager says that playlists got imported, but nothing has appeared - repeat all the steps, but instead of choosing your version, choose the "Shared" version on the very top.
8. On the top right while looking at the playlist list - click on "3 dots" menu.
9. Choose "Synchronize playlists".
`)
  .header("Run the game {#installation-pcvr-bsmanager-run-the-game}", 4)
  .paragraph(`\
Get into Solo mode and then head into the Browse tab (the 2nd tab) - you will get new playlists on the right of the Filter tab.
`)


  // PCVR Manual
  .header("Manual {#installation-pcvr-manual}", 3)
  .list([
    "[Requirements](#installation-pcvr-manual-requirements)",
    "[Get the zip](#installation-pcvr-manual-get-the-zip)",
    "[Locate Playlists folder](#installation-pcvr-manual-locate-playlists-folder)",
    "[Unpack the zip into the Playlists folder](#installation-pcvr-manual-unpack-the-zip-into-playlists-folder)",
    "[Run the game](#installation-pcvr-manual-run-the-game)"
  ], ListTypes.Ordered)
  .header("Requirements {#installation-pcvr-manual-requirements}", 4)
  .paragraph(`\
You need Playlist mod - PlaylistManger.
You can get it via:

1. [BSManager](https://www.bsmanager.io/)
2. [ModAssistant](https://github.com/Assistant/ModAssistant/releases/tag/v1.1.32)
3. [BeatMods](https://beatmods.com/mods/170)
4. [GitHub](https://github.com/rithik-b/PlaylistManager#download)
`)
  .header("Get the zip {#installation-pcvr-manual-get-the-zip}", 4)
  .paragraph(getTheZip)
  .header("Locate Playlists folder {#installation-pcvr-manual-locate-playlists-folder}", 4)
  .paragraph(`\
Depending on how do you have your game installed, if you use:

* BSManager - right-click the game version that you are using, click "Open Folder".
* Steam - right-click Beat Saber in the library, hover over "Manage", click "Browse local files".
* Meta store - I need info on this, but if you are able to locate your Beat Saber folder, follow the guide normally.

Inside the Beat Saber root folder, the one that has "Beat Saber.exe" in it - there should be "Playlists" folder, if it is missing - create it.
Get into that folder.
`)
  .header("Unpack the zip into the Playlists folder {#installation-pcvr-manual-unpack-the-zip-into-playlists-folder}", 4)
  .paragraph(`\
If you have a lot of playlists, create a folder called "Tower of Tech", get into there.

Paste the cut file into the Playlists or "Tower of Tech" folder and unpack it.
`)
  .header("Run the game {#installation-pcvr-manual-run-the-game}", 4)
  .paragraph(`\
Get into Solo mode and then head into the Browse tab (the 2nd tab) - you will get new playlists on the right of the Filter tab.

These playlists most likely will appear to be empty, because maps are missing.
Choose a playlist from the tile list, on each of them press the "Synchronize" button which is in top right corner of the playlist cover image.

(You can go and play a map or two while Beat Saber downloads maps in the background)
`)
  .content;

const _markdownContentArr = _markdownContent
  .split("\n")
  .map(line => {

    // lines that start with # - assuming headers
    // can have "{#id}" syntax which GH doesn't render, instead - it understands named empty links
    // these following lines are transforming "{#id}" into '<a name="id"></a>'
    if (line.startsWith("#")) {
      return line
        .split("{#")
        .join("<a name=\"")
        .split("}")
        .join("\"></a>");
    }

    return line;
  })
const _markdownContentArrFiltered = _markdownContentArr.filter((_, i) => i !== _markdownContentArr.length - 1);
const markdownContent = _markdownContentArrFiltered.join("\n")

await Deno.writeTextFile("./INSTALLATION.md", markdownContent);

