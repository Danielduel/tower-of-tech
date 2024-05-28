import { ChannelType } from "@/apps/discord-bot/deps.ts";
import { CommandEmptyInteraction } from "@/apps/discord-bot/commands/types.ts";

export function getChannelPointer(channel: CommandEmptyInteraction["channel"]) {
  switch (channel.type) {
    case ChannelType.PublicThread:
    case ChannelType.PrivateThread:
      return {
        guildId: channel.guild_id,
        channelId: channel.parent_id,
      };
    case ChannelType.GuildText:
      return {
        guildId: channel.guild_id,
        channelId: channel.id,
      };
    case ChannelType.DM:
    case ChannelType.GroupDM:
      return;
  }
}
