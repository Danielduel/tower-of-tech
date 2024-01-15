import { discordChannelToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelToBeatSaverData.ts";
import {
  ConnInfo,
  json,
  PathParams,
} from "https://deno.land/x/sift@0.6.0/mod.ts";
import {
  BeatSaberPlaylist,
  BeatSaberPlaylistSongItem,
} from "@/src/types/BeatSaberPlaylist.d.ts";
import { BeatSaverMapResponseSuccessSchema } from "@/packages/types/beatsaver.ts";
import { dbDiscordBot } from "@/packages/database-discord-bot/mod.ts";
import { filterNulls } from "@/packages/utils/filter.ts";

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

export async function playlistFromGuildChannel(
  request: Request,
  connInfo: ConnInfo,
  params: PathParams,
) {
  if (!params) return json("Invalid params");
  const guildId = params.guildId;
  const channelId = params.channelId;
  if (!guildId) return json("Invalid guild id");
  if (!channelId) return json("Invalid channel id");

  const discordChannelData = await dbDiscordBot.DiscordChannel
    .find(channelId)
    .then((x) => x?.flat());
  if (!discordChannelData) {
    return json("This channel is not registered (missing config data)");
  }
  if (discordChannelData.guildId !== guildId) {
    return json("Channel-Guild mismatch error");
  }

  const data = await discordChannelToBeatSaverData(
    guildId,
    channelId,
  );
  if (!data) return json({});

  const responsePlaylist: BeatSaberPlaylist = {
    playlistAuthor: "Discord ToT bot",
    playlistTitle: `${data.channelName} (${data.guildName}) - ToT Bot`,
    songs: beatSaverResolvedToSongs(data.resolved),
    image: "",
    customData: {
      syncURL:
        `https://danielduel-tot-bot.deno.dev/api/playlist/guild/${guildId}/channel/${channelId}`,
    },
  };

  return json(responsePlaylist);
}
