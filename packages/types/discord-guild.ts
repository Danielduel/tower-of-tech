import { z } from "zod";

export const DiscordChannelSchema = z.object({
  channelId: z.string(),
  guildId: z.string(),
  addedBy: z.string(),

  markedAsPlaylist: z.boolean(),
});
export type DiscordChannelSchemaT = typeof DiscordChannelSchema._type;

export const DiscordGuildFlatSchema = z.object({
  guildId: z.string(),
  addedBy: z.string(),
  channels: z.array(z.string()),
});
export type DiscordGuildFlatSchemaT = typeof DiscordGuildFlatSchema._type;

export const DiscordGuildSchema = z.object({
  guildId: z.string(),
  addedBy: z.string(),
  channels: z.array(DiscordChannelSchema),
});
