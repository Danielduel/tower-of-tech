import { z } from "zod";

export const DiscordChannelSchema = z.object({
  channelId: z.string(),
  guildId: z.string(),
  addedBy: z.string(),

  markedAsPlaylist: z.boolean(),
});

export const DiscordGuildFlatSchema = z.object({
  guildId: z.string(),
  addedBy: z.string(),
  channels: z.array(z.string()),
});

export const DiscordGuildSchema = z.object({
  guildId: z.string(),
  addedBy: z.string(),
  channels: z.array(DiscordChannelSchema),
});
