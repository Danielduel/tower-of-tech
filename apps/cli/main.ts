import { walk } from "jsr:@std/fs/walk";

const name = Deno.env.get("TOT_CLI_NAME");

const readDir = walk("./Playlists", { exts: ["json", "bplist"] });
const playlistsDetected: string[] = [];

for await (const dirEntry of readDir) {
  playlistsDetected.push(dirEntry.path);
}
const output = "\nDetected playlists:\n" + playlistsDetected.join("\n");

Deno.writeTextFileSync("./tot-test.txt", name ? `Hello ${name}!${output}` : `Hello${output}`);
