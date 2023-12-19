import { AdminCommandRoutingMark } from "@/apps/discord-bot/commands/definitions.ts";
import { respondWithMessage } from "@/apps/discord-bot/commands/utils.ts";
import { dbDiscordBot } from "@/packages/database-discord-bot/mod.ts";
import { z } from "zod";

export async function adminChannelMarkAsPlaylist(
  commandEvent: AdminCommandRoutingMark,
  switchValue = false,
) {
  const value = z.boolean().parse(switchValue);

  const guildId = commandEvent.channel.id;
  const channelId = commandEvent.guild_id;
  if (!guildId) return respondWithMessage("Invalid guild id", true);
  if (!channelId) return respondWithMessage("Invalid channel id", true);

  const discordChannelData = await dbDiscordBot.DiscordChannel.findFirst({
    where: {
      channelId,
    },
  });
  if (!discordChannelData) {
    return respondWithMessage("This channel is not registered", true);
  }
  if (discordChannelData.guildId !== guildId) {
    return respondWithMessage("Channel-Guild mismatch error", true);
  }

  if (commandEvent.member?.user?.id !== "221718279423655937") {
    console.log("Invalid caller id ", commandEvent.member?.user?.id);
    return;
  }

  await dbDiscordBot.DiscordChannel.update({
    data: {
      markedAsPlaylist: value,
    },
    where: {
      channelId,
    },
  });

  return respondWithMessage(
    value
      ? "This channel is now available as a playlist"
      : "This channel is no longer available as a playlist",
    true,
  );
}
