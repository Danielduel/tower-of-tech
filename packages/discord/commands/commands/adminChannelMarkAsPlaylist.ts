import { z } from "zod";
import { respondWithMessage } from "@/packages/discord/commands/utils.ts";
import { DB } from "@tot/db";
import { getChannelPointer } from "@/packages/discord/shared/getChannelPointer.ts";
import { ChannelTypes, DiscordInteraction } from "@/packages/discord/deps.ts";

export async function adminChannelMarkAsPlaylist(
  commandEvent: DiscordInteraction,
  switchValue = false,
) {
  const value = z.boolean().parse(switchValue);

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

  const db = await DB.get();
  const discordChannelData = await db.DiscordChannel
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

  await db.DiscordChannel
    .update(channelId, {
      markedAsPlaylist: value,
    });

  return respondWithMessage(
    value ? "This channel is now available as a playlist" : "This channel is no longer available as a playlist",
    true,
  );
}
