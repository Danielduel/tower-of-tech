import { respondWithMessage } from "@/packages/discord/commands/utils.ts";
import { dbEditor } from "@/packages/database-editor/mod.ts";
import { getChannelPointer } from "@/packages/discord/shared/getChannelPointer.ts";
import { DiscordIncomingWebhook } from "@/packages/discord/deps.ts";

export async function adminChannelRegister(
  commandEvent: DiscordIncomingWebhook,
) {
  if (!commandEvent.source_channel) {
    console.error(`adminChannelRegister: no source channel`);
    throw "No source channel";
  }
  const channelPointer = getChannelPointer(commandEvent.source_channel);

  if (!channelPointer) {
    console.log(`Unsupported channel type ${commandEvent.source_channel.type}`);
    return respondWithMessage("Unsupported channel type", true);
  }

  const {
    guildId,
    channelId,
  } = channelPointer;

  if (!guildId) return respondWithMessage("Invalid guild id", true);
  if (!channelId) return respondWithMessage("Invalid channel id", true);
  if (!commandEvent.user) return respondWithMessage("Invalid user", true);

  if (commandEvent.user.id !== "221718279423655937") {
    console.log("Invalid caller id ", commandEvent.user.id);
    return;
  }
  console.log(`Registering channel ${channelId} from guild ${guildId}`);

  const discordChannelData = await dbEditor.DiscordChannel
    .find(channelId)
    .then((x) => x?.flat());
  const discordGuildData = await dbEditor.DiscordGuild
    .find(guildId)
    .then((x) => x?.flat());
  if (discordChannelData) {
    return respondWithMessage("This channel is already registered", true);
  }

  await dbEditor.DiscordChannel.add({
    channelId,
    guildId,
    addedBy: commandEvent.user.id,
    markedAsPlaylist: false,
  });

  if (!discordGuildData) {
    await dbEditor.DiscordGuild.add({
      guildId,
      addedBy: commandEvent.user.id,
      channels: [channelId],
    });
  } else {
    await dbEditor.DiscordGuild.update(guildId, {
      channels: [...discordGuildData.channels, channelId],
    });
  }

  return respondWithMessage(
    discordGuildData
      ? "This channel is now registered and added to existing guild"
      : "This channel is now registered and added to a new guild",
    true,
  );
}
