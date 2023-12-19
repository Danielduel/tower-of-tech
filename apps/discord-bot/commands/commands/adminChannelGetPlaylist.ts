import { GatewayIntentBits } from "https://deno.land/x/discord_api_types@0.37.62/v10.ts";
import { useClient } from "@/apps/discord-bot/client.ts";
import { respondWithMessage } from "@/apps/discord-bot/commands/utils.ts";
import { discordChannelHistoryToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelHistoryToBeatSaverData.ts";
import { AdminCommandRoutingGet } from "@/apps/discord-bot/commands/definitions.ts";
import { dbDiscordBot } from "@/packages/database-discord-bot/mod.ts";

export async function adminChannelGetPlaylist(
  commandEvent: AdminCommandRoutingGet,
) {
  const guildId = commandEvent.guild_id;
  const channelId = commandEvent.channel.id;
  if (!guildId) return respondWithMessage("Invalid guild id", true);
  if (!channelId) return respondWithMessage("Invalid channel id", true);
  const discordChannelData = await dbDiscordBot.DiscordChannel.findFirst({
    where: {
      channelId
    }
  });
  if (!discordChannelData) return respondWithMessage("This channel is not registered", true);
  if (discordChannelData.guildId !== guildId) return respondWithMessage("Channel-Guild mismatch error", true);
  if (!discordChannelData.markedAsPlaylist) return respondWithMessage("This channel doesn't support being a playlist", true);

  if (commandEvent.member?.user?.id !== "221718279423655937") {
    console.log("Invalid caller id ", commandEvent.member?.user?.id);
    return;
  }
  return await useClient([
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessages,
  ], async (client) => {
    const messagesWithResolved = await discordChannelHistoryToBeatSaverData(
      client,
      guildId,
      channelId,
    );
    if (!messagesWithResolved) return;

    const response = `I would create a playlist of:
    ${
      messagesWithResolved.map((x) => `
    ${x?.beatSaverData?.versions[0].hash}
    (${x?.beatSaverData?.name} mapped by ${x?.beatSaverData?.uploader.name})`)
        .join("\n")
    }

    And it would be available here:
    https://danielduel-tot-bot.deno.dev/api/playlist/guild/${guildId}/channel/${channelId}
    `;
    // console.log(response);
    return respondWithMessage(response);
  });
}
