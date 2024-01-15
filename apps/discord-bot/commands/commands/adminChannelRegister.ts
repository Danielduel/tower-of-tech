import { respondWithMessage } from "@/apps/discord-bot/commands/utils.ts";
import { dbDiscordBot } from "@/packages/database-discord-bot/mod.ts";
import { CommandEmptyInteraction } from "@/apps/discord-bot/commands/types.ts";
import { getChannelPointer } from "@/apps/discord-bot/shared/getChannelPointer.ts";

export async function adminChannelRegister(
  commandEvent: CommandEmptyInteraction,
) {
  const channelPointer = getChannelPointer(commandEvent.channel);

  if (!channelPointer) {
    console.log(`Unsupported channel type ${commandEvent.channel.type}`);
    return respondWithMessage("Unsupported channel type", true);
  }

  const {
    guildId,
    channelId,
  } = channelPointer;

  if (!guildId) return respondWithMessage("Invalid guild id", true);
  if (!channelId) return respondWithMessage("Invalid channel id", true);

  if (commandEvent.member?.user?.id !== "221718279423655937") {
    console.log("Invalid caller id ", commandEvent.member?.user?.id);
    return;
  }
  console.log(`Registering channel ${channelId} from guild ${guildId}`);

  const discordChannelData = await dbDiscordBot.DiscordChannel
    .find(channelId)
    .then((x) => x?.flat());
  const discordGuildData = await dbDiscordBot.DiscordGuild
    .find(guildId)
    .then((x) => x?.flat());
  if (discordChannelData) {
    return respondWithMessage("This channel is already registered", true);
  }

  await dbDiscordBot.DiscordChannel.add({
    channelId,
    guildId,
    addedBy: commandEvent.member?.user?.id,
    markedAsPlaylist: false,
  });

  if (!discordGuildData) {
    await dbDiscordBot.DiscordGuild.add({
      guildId,
      addedBy: commandEvent.member?.user?.id,
      channels: [channelId],
    });
  } else {
    await dbDiscordBot.DiscordGuild.update(guildId, {
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
