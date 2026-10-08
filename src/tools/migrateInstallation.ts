import { ListTypes, Markdown } from "https://deno.land/x/deno_markdown@v0.2/mod.ts";
import { kofi } from "@/src/tools/mdUtil.ts";

const markdown = new Markdown();
const _markdownContent = markdown
  .paragraph(kofi)
  .header(`Tower of Tech`, 1)
  .header("Installation", 1)
  .list([
    "[PCVR](#PCVR)",
    "Standalone" // "[Standalone](#Standalone)"
  ], ListTypes.UnOrdered)
  .header("PCVR", 2)
  .list([
    "[Manual](#Manual)"
  ], ListTypes.UnOrdered)
  .header("Manual", 3)
  .list([
    "Requirements",
    "Get the zip",
    "Locate Playlists folder",
    "Unpack the zip into the Playlists folder",
    "Run the game"
  ], ListTypes.Ordered)
  .content;

const _markdownContentArr = _markdownContent.split("\n");
const _markdownContentArrFiltered = _markdownContentArr.filter((_, i) => i !== _markdownContentArr.length - 1);
const markdownContent = _markdownContentArrFiltered.join("\n");

await Deno.writeTextFile("./INSTALLATION.md", markdownContent);

