import { GatewayIntentBits } from "https://deno.land/x/discord_api_types@0.37.62/v10.ts";
import { findAndResolveUrlsToBeatSaverData } from "@/packages/community/findAndResolveUrlsToBeatSaverData.ts";
import { CommandEmptyInteraction } from "@/apps/discord-bot/commands/types.ts";
import { useClient } from "@/apps/discord-bot/client.ts";
import { respondWithMessage } from "@/apps/discord-bot/commands/utils.ts";
import { discordChannelHistoryToBeatSaverData } from "@/apps/discord-bot/shared/discordChannelHistoryToBeatSaverData.ts";

export async function executeCreateChannelPlaylist(
  commandEvent: CommandEmptyInteraction,
) {
  const guildId = "689050370840068309";
  const channelId = "1186318031907979314";
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
    `;
    // console.log(response);
    return respondWithMessage(response);
  });
}
