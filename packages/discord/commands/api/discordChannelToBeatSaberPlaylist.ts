import { discordChannelToBeatSaverData } from "@/packages/discord/shared/discordChannelToBeatSaverData.ts";
import { BeatSaberPlaylist, BeatSaberPlaylistSongItem } from "@/src/types/BeatSaberPlaylist.d.ts";
import { BeatSaverMapResponseSuccessSchema } from "@/packages/types/beatsaver.ts";
import { dbEditor } from "@/packages/database-editor/mod.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { links } from "@/apps/website/routing.config.ts";
import { towerOfTechWebsiteOrigin } from "@/packages/utils/constants.ts";

const beatSaverResolvedToSongs = (
  arr: (
    | typeof BeatSaverMapResponseSuccessSchema._type
    | null
    | undefined
  )[],
): BeatSaberPlaylistSongItem[] => {
  return arr
    .flatMap((data) => {
      if (!data) return null;
      return {
        difficulties: [],
        hash: data.versions[0].hash ?? "",
        levelAuthorName: data.uploader.name ?? "",
        levelid: `custom_level_${data.versions[0].hash}`,
        songName: data.name ?? "",
        key: data.id ?? "",
      };
    })
    .filter(filterNulls);
};

export async function discordChannelToBeatSaberPlaylist(
  guildId: string,
  channelId: string,
) {
  if (!guildId) throw "Invalid guild id";
  if (!channelId) throw "Invalid channel id";

  const discordChannelData = await dbEditor.DiscordChannel
    .find(channelId)
    .then((x) => x?.flat());
  if (!discordChannelData) {
    throw "This channel is not registered (missing config data)";
  }
  if (discordChannelData.guildId !== guildId) {
    throw "Channel-Guild mismatch error";
  }

  const data = await discordChannelToBeatSaverData(
    guildId,
    channelId,
  );
  if (!data) throw "No data";

  const responsePlaylist: BeatSaberPlaylist = {
    playlistAuthor: "Discord ToT bot",
    playlistTitle: `${data.channelName} (${data.guildName}) - ToT Bot`,
    songs: beatSaverResolvedToSongs(data.resolved),
    image: "",
    customData: {
      syncURL: links.api.v1.discord.playlist.download(
        guildId,
        channelId,
        towerOfTechWebsiteOrigin,
      ),
    },
  };

  return responsePlaylist;
}
