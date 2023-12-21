import { respondWithMessage } from "@/apps/discord-bot/commands/utils.ts";
import { discordChannelHistoryToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelHistoryToBeatSaverData.ts";
import { AdminCommandRoutingGet } from "@/apps/discord-bot/commands/definitions.ts";
import { dbDiscordBot } from "@/packages/database-discord-bot/mod.ts";
import { getChannelPointer } from "@/apps/discord-bot/shared/getChannelPointer.ts";

export async function adminChannelGetPlaylist(
  commandEvent: AdminCommandRoutingGet,
) {
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

  const discordChannelData = await dbDiscordBot.DiscordChannel.findFirst({
    where: {
      channelId,
    },
  });
  if (!discordChannelData) {
    return respondWithMessage("This channel is not registered (missing config data)", true);
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
  const data = await discordChannelHistoryToBeatSaverData(
    guildId,
    channelId,
  );
  if (!data) return;

  const response = `I would create a playlist of:
    ${
    data.map((x) => `
    ${x?.versions[0].hash}
    (${x?.name} mapped by ${x?.uploader.name})`)
      .join("\n")
  }

    And it would be available here:
    https://danielduel-tot-bot.deno.dev/api/playlist/guild/${guildId}/channel/${channelId}
    `;
  // console.log(response);
  return respondWithMessage(response);
}
