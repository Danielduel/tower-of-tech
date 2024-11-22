import { TwitchIRCEmitter } from "@/apps/twitch-bot/types.ts";
import { dbEditor } from "@/packages/database-editor/mod.ts";
import { makeBroadcasterId } from "@/packages/api-twitch/helix/brand.ts";
import { ChannelRole } from "https://deno.land/x/twitch_irc@0.11.2/lib/ratelimit.ts";
import type { ResendLinkChannel } from "@/apps/twitch-bot/resendLink/ResendLinkChannel.ts";
import { ResendLinkTwitchChannelSettingsFlatSchemaT } from "@/packages/types/resendLink.ts";

export const resendLinkCommand = (
  irc: TwitchIRCEmitter,
  _log: ResendLinkChannel["log"],
  settings?: ResendLinkTwitchChannelSettingsFlatSchemaT,
) => {
  const log = (message: string) => _log(`resend ${message}`);
  log("register");

  irc.on("privmsg", async ({ event, context: { send } }) => {
    const [cmd, ...args] = event.message.split(" ");
    const isModeratorOrAbove = event.user.role === ChannelRole.Moderator || event.user.role === ChannelRole.Streamer;
    const shouldHandle = cmd.startsWith("!!") && isModeratorOrAbove;

    if (!shouldHandle) return;

    const items = (await dbEditor.ResendLinkTwitchBeatSaverResolvableIdKind.findBySecondaryIndex(
      "targetId",
      makeBroadcasterId(event.roomId),
    ))
      .result
      .filter((x) => x.value.status === "not delivered");

    const item = items[0];

    if (!item) {
      send("! No resend links left");
      return;
    }

    const msg = `!bsr ${item.value.data}`;
    log(`${item.value.targetLogin} "${msg}"`);
    send(msg);

    // const sendedM = await send(msg);
    // .confirm();
    // if (sendedM.isOk()) {
    log(`deleting ${item.id} from ${item.value.targetLogin}`);
    await dbEditor.ResendLinkTwitchBeatSaverResolvableIdKind.delete(item.id);
    //   return;
    // }
    // log(`failed to deliver "${msg}" to ${event.channel}`);

    return;
  });
};
