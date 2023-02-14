import type { BeatSaberPlaylist } from "../types/BeatSaberPlaylist.d.ts";
import { emptyCover } from "../utils/empty-cover.ts";
import { getMapDataByKey } from "../utils/beatsaver.ts";

const destinationPath = new URL(import.meta.resolve("../../migrated/playlists")).pathname;

const songData = await getMapDataByKey("1a593");
if ("error" in songData) {
  console.error("Error getting songData");
  Deno.exit();
}

const playlist: BeatSaberPlaylist = {
  image: emptyCover,
  playlistAuthor: "Danielduel",
  playlistTitle: "ToT - Cup of a day",
  customData: {
    owner: "Danielduel",
    syncURL: "https://raw.githubusercontent.com/Danielduel/tower-of-tech/main/migrated/playlists/ToT_-_coad.bplist"
  },
  songs: [{
    difficulties: [{ characteristic: "Standard", name: "Expert" }],
    hash: songData.versions[0].hash,
    levelid: `custom_level_${songData.versions[0].hash}`
  }]
};

const playlistJSON = JSON.stringify(playlist);

Deno.writeTextFileSync(destinationPath + "/" + "ToT_-_coad.bplist", playlistJSON);
