import { respondWithMessage } from "@/apps/discord-bot/commands/utils.ts";
import { dbDiscordBot } from "@/packages/database-discord-bot/mod.ts";
import { CommandEmptyInteraction } from "@/apps/discord-bot/commands/types.ts";

export async function adminChannelRegister(
  commandEvent: CommandEmptyInteraction,
) {
  const guildId = commandEvent.guild_id;
  const channelId = commandEvent.channel.id;
  if (!guildId) return respondWithMessage("Invalid guild id", true);
  if (!channelId) return respondWithMessage("Invalid channel id", true);

  const discordChannelData = await dbDiscordBot.DiscordChannel.findFirst({
    where: {
      channelId,
    },
  });
  const discordGuildData = await dbDiscordBot.DiscordGuild.findFirst({
    where: {
      guildId,
    },
  });
  if (discordChannelData) {
    return respondWithMessage("This channel is already registered", true);
  }

  if (commandEvent.member?.user?.id !== "221718279423655937") {
    console.log("Invalid caller id ", commandEvent.member?.user?.id);
    return;
  }

  console.log(`Registering channel ${channelId} from guild ${guildId}`);

  await dbDiscordBot.DiscordChannel.create({
    data: {
      channelId,
      guildId,
      addedBy: commandEvent.member?.user?.id,
      markedAsPlaylist: false,
    },
  });

  if (!discordGuildData) {
    await dbDiscordBot.DiscordGuild.create({
      data: {
        guildId,
        addedBy: commandEvent.member?.user?.id,
        channels: [ channelId ]
      },
    });
  } else {
    await dbDiscordBot.DiscordGuild.update({
      data: {
        channels: [ ...discordGuildData.channels, channelId ]
      },
      where: {
        guildId
      }
    });
  }

  return respondWithMessage(
    discordGuildData
      ? "This channel is now registered and added to existing guild"
      : "This channel is now registered and added to a new guild",
    true,
  );
}
