import { TableDefinition } from "pentagon";
import { DiscordChannelSchema, DiscordGuildFlatSchema } from "@/packages/types/discord-guild.ts";

export const DiscordChannel = {
  schema: DiscordChannelSchema,
} satisfies TableDefinition<typeof DiscordChannelSchema.shape>;

export const DiscordGuild = {
  schema: DiscordGuildFlatSchema,
  relations: {
    channels: [
      "DiscordChannel",
      [DiscordChannelSchema],
      "channels",
      "channelId",
    ],
  },
} satisfies TableDefinition<typeof DiscordGuildFlatSchema.shape>;
