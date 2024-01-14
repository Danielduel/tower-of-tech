import { collection } from "kvdex/mod.ts";
import { zodModel } from "kvdex/ext/zod.ts"
import { DiscordChannelSchema, DiscordGuildFlatSchema } from "@/packages/types/discord-guild.ts";

export const DiscordChannel = collection(
  zodModel(DiscordChannelSchema),
  {
    history: true,
    indices: {
      channelId: "primary",
      guildId: "secondary",
    }
  }
);

export const DiscordGuild = collection(
  zodModel(DiscordGuildFlatSchema),
  {
    history: true,
    indices: {
      guildId: "primary"
    }
  }
);
