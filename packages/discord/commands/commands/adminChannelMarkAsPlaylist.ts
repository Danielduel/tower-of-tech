import { z } from "zod";
import { AdminCommandRoutingMark } from "@/packages/discord/commands/definitions.ts";
import { respondWithMessage } from "@/packages/discord/commands/utils.ts";
import { dbEditor } from "@/packages/database-editor/mod.ts";
import { getChannelPointer } from "@/packages/discord/shared/getChannelPointer.ts";

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

  if (commandEvent.member?.user?.id !== "221718279423655937") {
    console.log("Invalid caller id ", commandEvent.member?.user?.id);
    return;
  }

  await dbEditor.DiscordChannel
    .update(channelId, {
      markedAsPlaylist: value,
    });

  return respondWithMessage(
    value
      ? "This channel is now available as a playlist"
      : "This channel is no longer available as a playlist",
    true,
  );
}
