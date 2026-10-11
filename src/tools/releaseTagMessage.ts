import { kofi } from "@/src/tools/mdUtil.ts";
import { Markdown } from "https://deno.land/x/deno_markdown@v0.2/mod.ts";
import { PlaylistsTable } from "@/src/tools/md-components/PlaylistsTable.ts";

const markdown = new Markdown();

const text = `
${kofi}

---

Update map pool :rocket:

---

${PlaylistsTable(markdown).content}

`

await Deno.writeTextFile("./TAG.md", text);


