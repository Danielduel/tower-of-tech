import { BeatSaberPlaylistSchema } from "@/types/beatsaber-playlist.ts";

export const readPlaylistFile = (path: string): typeof BeatSaberPlaylistSchema._type => {
  return JSON.parse(Deno.readTextFileSync(path));
}
