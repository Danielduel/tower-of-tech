import { Handlers } from "$fresh/server.ts";
import { discordChannelToBeatSaberPlaylist } from "@/packages/discord/commands/api/discordChannelToBeatSaberPlaylist.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const guildId = ctx.params.guildId;
    if (!guildId) throw 400;

    const channelId = ctx.params.channelId;
    if (!channelId) throw 400;

    const data = await discordChannelToBeatSaberPlaylist(
      guildId,
      channelId,
    );
    if (!data) return new Response("404", { status: 404 });

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  },
};
