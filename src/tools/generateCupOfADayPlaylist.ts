import type { BeatSaberPlaylist } from "../types/BeatSaberPlaylist.d.ts";
import { getMapDataByKey } from "../utils/beatsaver.ts";
import { fixPlaylistHashes } from "../utils/beatsaber-playlist.ts";
import { stringify } from "../utils/json.ts";

const destinationPath = new URL(import.meta.resolve("../../migrated/playlists")).pathname;

const songData = await getMapDataByKey("1fd56");
if ("error" in songData) {
  console.error("Error getting songData");
  Deno.exit();
}

const playlist: BeatSaberPlaylist = {
  image: "",
  playlistAuthor: "Danielduel",
  playlistTitle: "ToT - Cup of a day",
  customData: {
    owner: "Danielduel",
    syncURL: "https://raw.githubusercontent.com/Danielduel/tower-of-tech/main/migrated/playlists/ToT_-_coad.bplist"
  },
  songs: [{
    songName: songData.name,
    levelAuthorName: songData.uploader.name ?? "",
    hash: songData.versions[0].hash,
    levelid: `custom_level_${songData.versions[0].hash}`,
    difficulties: [{ characteristic: "Standard", name: "ExpertPlus" }],
  }]
};

const playlistJSON = stringify(fixPlaylistHashes(playlist));

Deno.writeTextFileSync(destinationPath + "/" + "ToT_-_coad.bplist", playlistJSON);
