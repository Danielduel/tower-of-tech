import { ChannelTypes, DiscordChannel } from "@/apps/discord-bot/deps.ts";

export function getChannelPointer(channel: Partial<DiscordChannel>) {
  switch (channel.type) {
    case ChannelTypes.GuildPublicThread:
    case ChannelTypes.GuildPrivateThread:
      return {
        guildId: channel.guild_id,
        channelId: channel.parent_id,
      };
    case ChannelTypes.GuildText:
      return {
        guildId: channel.guild_id,
        channelId: channel.id,
      };
    case ChannelTypes.DM:
    case ChannelTypes.GroupDm:
      return;
  }
}
