import { discordChannelToBeatSaverData } from "@/packages/discord/shared/discordChannelToBeatSaverData.ts";
import { BeatSaverMapResponseSuccessSchema } from "@/packages/types/beatsaver.ts";
import { dbEditor } from "@/packages/database-editor/mod.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { links } from "@/apps/website/routing.config.ts";
import { towerOfTechWebsiteOrigin } from "@/packages/utils/constants.ts";
import { BeatSaverResolvable } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { matchBeatSaverResolvable } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import {
  BeatSaberPlaylistSongItemSchemaT,
  BeatSaberPlaylistWithoutIdSchemaT,
} from "@/packages/types/beatsaber-playlist.ts";
import {
  makeImageBase64,
  makePlaylistUrl,
  makeUppercaseMapHash,
  makeUppercaseMapHashForLevelId,
} from "@/packages/types/brands.ts";

const beatSaverMergeResponseAndResolvablesDiffToSongsItems = (resolvables: BeatSaverResolvable[], resolved: (
  | typeof BeatSaverMapResponseSuccessSchema._type
  | null
  | undefined
)[]): BeatSaberPlaylistSongItemSchemaT[] => {
  const out = resolvables.map((resolvable) => {
    return matchBeatSaverResolvable<BeatSaberPlaylistSongItemSchemaT | null, BeatSaberPlaylistSongItemSchemaT | null>({
      onHashResolvable: (r) => {
        const data = resolved.find((x) => x?.versions[0].hash === r.data);
        if (data) {
          const out: BeatSaberPlaylistSongItemSchemaT = {
            difficulties: r.diffs,
            hash: makeUppercaseMapHash(data.versions[0].hash ?? ""),
            levelAuthorName: data.uploader.name ?? "",
            levelid: makeUppercaseMapHashForLevelId(`custom_level_${data.versions[0].hash}`),
            songName: data.name ?? "",
            key: data.id ?? "",
          };
          return out;
        }
        return null;
      },
      onIdResolvable: (r) => {
        const data = resolved.find((x) => x?.id === r.data);
        if (data) {
          const out: BeatSaberPlaylistSongItemSchemaT = {
            difficulties: r.diffs,
            hash: makeUppercaseMapHash(data.versions[0].hash ?? ""),
            levelAuthorName: data.uploader.name ?? "",
            levelid: makeUppercaseMapHashForLevelId(`custom_level_${data.versions[0].hash}`),
            songName: data.name ?? "",
            key: data.id ?? "",
          };
          return out;
        }

        return null;
      },
    })(resolvable);
  })
    .filter(filterNulls);

  return out;
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

  const responsePlaylist: BeatSaberPlaylistWithoutIdSchemaT = {
    playlistAuthor: "Discord ToT bot",
    playlistTitle: `${data.channelName} (${data.guildName}) - ToT Bot`,
    songs: beatSaverMergeResponseAndResolvablesDiffToSongsItems(data.resolvables, data.resolved),
    image: makeImageBase64(""),
    customData: {
      syncURL: makePlaylistUrl(links.api.v1.discord.playlist.download(
        guildId,
        channelId,
        towerOfTechWebsiteOrigin,
      )),
    },
  };

  return responsePlaylist;
}
