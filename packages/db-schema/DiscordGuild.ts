import { collection } from "@/packages/deps/kvdex.ts";
import { DiscordChannelSchema, DiscordGuildFlatSchema } from "@/packages/types/discord-guild.ts";

export const DiscordChannel = collection(
  DiscordChannelSchema,
  {
    idGenerator: (item) => item.channelId,
    history: true,
    indices: {
      guildId: "secondary",
    },
  },
);

export const DiscordGuild = collection(
  DiscordGuildFlatSchema,
  {
    idGenerator: (item) => item.guildId,
    history: true,
  },
);
