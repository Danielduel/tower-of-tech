import { ListTypes, Markdown } from "https://deno.land/x/deno_markdown@v0.2/mod.ts";
import { kofi } from "@/src/tools/mdUtil.ts";

const markdown = new Markdown();
const _markdownContent = markdown
  .paragraph(kofi)
  .header(`Tower of Tech`, 1)
  .header("Installation", 1)
  .list([
    "[PCVR](#installation-pcvr)",
    "Standalone" // "[Standalone](#Standalone)"
  ], ListTypes.UnOrdered)
  .header("PCVR {#installation-pcvr}", 2)
  .list([
    "[Manual](#installation-pcvr-manual)"
  ], ListTypes.UnOrdered)
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
1. [BSManager]("https://www.bsmanager.io/")
2. [ModAssistant]("https://github.com/Assistant/ModAssistant/releases/tag/v1.1.32")
3. [BeatMods]("https://beatmods.com/#/mods")
4. [GitHub]("https://github.com/rithik-b/PlaylistManager#download")
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

