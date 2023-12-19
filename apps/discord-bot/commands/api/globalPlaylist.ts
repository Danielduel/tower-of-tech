import { GatewayIntentBits } from "https://deno.land/x/discord_api_types@0.37.62/v10.ts";
import { useClient } from "@/apps/discord-bot/client.ts";
import { discordChannelHistoryToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelHistoryToBeatSaverData.ts";
import { json } from "https://deno.land/x/sift@0.6.0/mod.ts";
import {
  BeatSaberPlaylist,
  BeatSaberPlaylistSongItem,
} from "@/src/types/BeatSaberPlaylist.d.ts";
import { BeatSaverMapResponseSuccessSchema } from "@/packages/types/beatsaver.ts";

const guildId = "689050370840068309";
const channelId = "1186318031907979314";

const messagesWithResolvedToSongs = (
  arr: {
    beatSaverData:
      | typeof BeatSaverMapResponseSuccessSchema._type
      | null
      | undefined;
  }[],
): BeatSaberPlaylistSongItem[] => {
  return arr.map((data) => {
    return {
      difficulties: [],
      hash: data.beatSaverData?.versions[0].hash ?? "",
      levelAuthorName: data.beatSaverData?.uploader.name ?? "",
      levelid: `custom_level_${data.beatSaverData?.versions[0].hash}`,
      songName: data.beatSaverData?.name ?? "",
      key: data.beatSaverData?.id ?? "",
    };
  });
};

export async function globalPlaylist(request: Request) {
  return await useClient([
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ], async (client) => {
    const messagesWithResolved = await discordChannelHistoryToBeatSaverData(
      client,
      guildId,
      channelId,
    );
    if (!messagesWithResolved) return json({});

    const responsePlaylist: BeatSaberPlaylist = {
      playlistAuthor: "Discord ToT bot",
      playlistTitle: "ToT - Discord playlist",
      songs: messagesWithResolvedToSongs(messagesWithResolved),
      image: "",
      customData: {
        syncURL: "https://danielduel-tot-bot.deno.dev/api/globalPlaylist"
      }
    };

    return json(responsePlaylist);
  });
}
