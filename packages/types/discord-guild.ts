import { z } from "zod";

export const DiscordChannelSchema = z.object({
  channelId: z.string().describe("primary"),
  guildId: z.string(),
  addedBy: z.string(),

  markedAsPlaylist: z.boolean(),
});

export const DiscordGuildSchema = z.object({
  guildId: z.string().describe("primary"),
  addedBy: z.string(),
  channels: z.array(DiscordChannelSchema),
});

export const DiscordGuildFlatSchema = z.object({
  guildId: z.string().describe("primary"),
  addedBy: z.string(),
  channels: z.array(z.string()),
});
