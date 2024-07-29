import { collection } from "kvdex/mod.ts";
import { zodModel } from "kvdex/ext/zod.ts";
import { DiscordChannelSchema, DiscordGuildFlatSchema } from "@/packages/types/discord-guild.ts";

export const DiscordChannel = collection(
  zodModel(DiscordChannelSchema),
  {
    idGenerator: (item) => item.channelId,
    history: true,
    indices: {
      guildId: "secondary",
    },
  },
);

export const DiscordGuild = collection(
  zodModel(DiscordGuildFlatSchema),
  {
    idGenerator: (item) => item.guildId,
    history: true,
  },
);
