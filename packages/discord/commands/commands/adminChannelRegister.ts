import { respondWithMessage } from "@/packages/discord/commands/utils.ts";
import { dbEditor } from "@/packages/database-editor/mod.ts";
import { getChannelPointer } from "@/packages/discord/shared/getChannelPointer.ts";
import { DiscordInteraction } from "@/packages/discord/deps.ts";
import { ChannelTypes } from "@/packages/discord/deps.ts";
import { links } from "@/apps/website/routing.config.ts";
import { towerOfTechWebsiteOrigin } from "@/packages/utils/constants.ts";

export async function adminChannelRegister(
  commandEvent: DiscordInteraction,
) {
  if (!commandEvent.channel_id) {
    console.error(`adminChannelRegister: no source channel`);
    throw "No source channel";
  }

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
  if (!commandEvent.member) return respondWithMessage("Invalid member", true);

  if (commandEvent.member.user.id !== "221718279423655937") {
    console.log("Invalid caller id ", commandEvent.member.user.id);
    return;
  }
  console.log(`Registering channel ${channelId} from guild ${guildId}`);

  const discordChannelData = await dbEditor.DiscordChannel
    .find(channelId)
    .then((x) => x?.flat());
  const discordGuildData = await dbEditor.DiscordGuild
    .find(guildId)
    .then((x) => x?.flat());

  const downloadLink = `[| Download link |](${
    links.api.v1.discord.playlist.download(
      guildId,
      channelId,
      towerOfTechWebsiteOrigin,
    )
  })`;
  if (discordChannelData) {
    return respondWithMessage(
      `This channel is already registered ${downloadLink}`,
      true,
    );
  }

  await dbEditor.DiscordChannel.add({
    channelId,
    guildId,
    addedBy: commandEvent.member.user.id,
    markedAsPlaylist: false,
  });

  if (!discordGuildData) {
    await dbEditor.DiscordGuild.add({
      guildId,
      addedBy: commandEvent.member.user.id,
      channels: [channelId],
    });
  } else {
    await dbEditor.DiscordGuild.update(guildId, {
      channels: [...discordGuildData.channels, channelId],
    }, { strategy: "merge-shallow" });
  }

  return respondWithMessage(
    discordGuildData
      ? `This channel is now registered and added to existing guild ${downloadLink}`
      : `This channel is now registered and added to a new guild ${downloadLink}`,
    true,
  );
}
