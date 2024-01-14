import { AdminCommandRoutingMark } from "@/apps/discord-bot/commands/definitions.ts";
import { respondWithMessage } from "@/apps/discord-bot/commands/utils.ts";
import { dbDiscordBot } from "@/packages/database-discord-bot/mod.ts";
import { z } from "zod";
import { getChannelPointer } from "@/apps/discord-bot/shared/getChannelPointer.ts";

export async function adminChannelMarkAsPlaylist(
  commandEvent: AdminCommandRoutingMark,
  switchValue = false,
) {
  const value = z.boolean().parse(switchValue);

  const channelPointer = getChannelPointer(commandEvent.channel);

  if (!channelPointer) {
    console.log(`Unsupported channel type ${commandEvent.channel.type}`);
    return respondWithMessage("Unsupported channel type", true);
  }

  const {
    guildId,
    channelId
  } = channelPointer;

  if (!guildId) return respondWithMessage("Invalid guild id", true);
  if (!channelId) return respondWithMessage("Invalid channel id", true);

  const discordChannelData = await dbDiscordBot.DiscordChannel
    .findByPrimaryIndex("channelId", channelId)
    .then(x => x?.flat());
  if (!discordChannelData) {
    return respondWithMessage("This channel is not registered (missing config data)", true);
  }
  if (discordChannelData.guildId !== guildId) {
    return respondWithMessage("Channel-Guild mismatch error", true);
  }

  if (commandEvent.member?.user?.id !== "221718279423655937") {
    console.log("Invalid caller id ", commandEvent.member?.user?.id);
    return;
  }

  await dbDiscordBot.DiscordChannel
    .updateByPrimaryIndex("channelId", channelId, {
      markedAsPlaylist: value
    });

    return respondWithMessage(
    value
      ? "This channel is now available as a playlist"
      : "This channel is no longer available as a playlist",
    true,
  );
}
