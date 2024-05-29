import { respondWithMessage } from "@/packages/discord/commands/utils.ts";
import { discordChannelToBeatSaverData } from "@/packages/discord/shared/discordChannelToBeatSaverData.ts";
import { dbEditor } from "@/packages/database-editor/mod.ts";
import { getChannelPointer } from "@/packages/discord/shared/getChannelPointer.ts";
import { ChannelTypes, DiscordInteraction } from "@/packages/discord/deps.ts";
import { links } from "@/apps/editor/routing.config.ts";
import { towerOfTechWebsiteOrigin } from "@/packages/utils/constants.ts";

export async function adminChannelGetPlaylist(
  commandEvent: DiscordInteraction,
) {
  // TODO: unhardcode this, it will not work for forum channels
  const channelPointer = getChannelPointer({
    type: ChannelTypes.GuildText,
    id: commandEvent.channel_id,
    guild_id: commandEvent.guild_id,
  });

  if (!channelPointer) {
    console.log(`Unsupported channel type`);
    return respondWithMessage("Unsupported channel type", true);
  }

  const {
    guildId,
    channelId,
  } = channelPointer;

  if (!guildId) return respondWithMessage("Invalid guild id", true);
  if (!channelId) return respondWithMessage("Invalid channel id", true);

  const discordChannelData = await dbEditor.DiscordChannel
    .find(channelId)
    .then((x) => x?.flat());
  if (!discordChannelData) {
    return respondWithMessage(
      "This channel is not registered (missing config data)",
      true,
    );
  }
  if (discordChannelData.guildId !== guildId) {
    return respondWithMessage("Channel-Guild mismatch error", true);
  }
  if (!discordChannelData.markedAsPlaylist) {
    return respondWithMessage(
      "This channel doesn't support being a playlist",
      true,
    );
  }

  if (commandEvent.member?.user?.id !== "221718279423655937") {
    console.log("Invalid caller id ", commandEvent.member?.user?.id);
    return;
  }
  const data = await discordChannelToBeatSaverData(
    guildId,
    channelId,
  );
  if (!data) return;

  const response = `I would create a playlist of:
    ${
    data.resolved.map((x) => `
    ${x?.versions[0].hash}
    (${x?.name} mapped by ${x?.uploader.name})`)
      .join("\n")
  }

    [| Download link |](${
    links.api.v1.discord.playlist.download(
      guildId,
      channelId,
      towerOfTechWebsiteOrigin,
    )
  })
  }
    `;
  // console.log(response);
  return respondWithMessage(response);
}
