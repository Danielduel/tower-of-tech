import { TwitchIRCEmitter } from "@/apps/twitch-bot/types.ts";
import { ResendLinkTwitchChannelSettingsFlatSchemaT } from "@/packages/types/resendLink.ts";
import { ResendLinkChannel } from "@/apps/twitch-bot/resendLink/ResendLinkChannel.ts";
import { manager } from "./shared.ts";
import { extractTwitchName, searchChannelByName } from "@/apps/twitch-bot/resendLink/utils.ts";
import { ChannelRole } from "https://deno.land/x/twitch_irc@0.11.2/lib/ratelimit.ts";

const masterChannel = Deno.env.get("TWITCH_INPERSONATION_MASTER")!;

export const controlCommands = (
  irc: TwitchIRCEmitter,
  _log: ResendLinkChannel["log"],
  settings?: ResendLinkTwitchChannelSettingsFlatSchemaT,
) => {
  const log = (message: string) => _log(`control ${message}`);
  log("register");

  irc.on("privmsg", async ({ event, context: { send } }) => {
    const [cmd, ...args] = event.message.split(" ");
    const shouldHandle = cmd.toLowerCase() === "!resend-link";
    const isMasterChannel = masterChannel === event.channel;
    const isBroadcaster = event.user.role === ChannelRole.Streamer;

    if (!shouldHandle || !isMasterChannel || !isBroadcaster) return;

    const [verb, param1] = args;

    switch (verb.toLowerCase()) {
      case "register": {
        const name = extractTwitchName(param1);
        const channelM = await searchChannelByName(name);
        if (channelM.isErr()) {
          send(channelM.unwrapErr().message);
          return;
        }
        const channel = channelM.unwrap();
        await manager.ensureChannelAndJoinFromTwitchChannel(channel);
        send(`! Setup for ${channel.broadcaster_login} finished`);
      }
    }
  });
};
