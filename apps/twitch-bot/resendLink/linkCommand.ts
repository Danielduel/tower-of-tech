import { TwitchIRCEmitter } from "@/apps/twitch-bot/types.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { findBeatSaverResolvables } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { BeatSaverResolvable } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { DB } from "@/packages/db/mod.ts";
import { ulid } from "@/packages/deps/ulid.ts";
import { makeBroadcasterId } from "@/packages/api-twitch/helix/brand.ts";
import { ResendLinkTwitchChannelSettingsFlatSchemaT } from "@/packages/types/resendLink.ts";
import { ResendLinkChannel } from "@/apps/twitch-bot/resendLink/ResendLinkChannel.ts";
import { manager } from "./shared.ts";
import { ChannelRole } from "https://deno.land/x/twitch_irc@0.11.2/lib/ratelimit.ts";

export const linkCommand = (
  irc: TwitchIRCEmitter,
  _log: ResendLinkChannel["log"],
  settings?: ResendLinkTwitchChannelSettingsFlatSchemaT,
) => {
  const log = (message: string) => _log(`link ${message}`);
  log("register");

  irc.on("privmsg", async ({ event, context: { send, waitForMessage } }) => {
    const db = await DB.get();
    const [cmd, ...args] = event.message.split(" ");
    const shouldHandle = cmd.toLowerCase() === "!link";

    if (!shouldHandle) return;
    const originalSender = event.user;
    const originalSenderNames: string[] = [
      originalSender.displayName ? `@${originalSender.displayName}` : null, // this is preferred because it's most common config
      originalSender.displayName ? originalSender.displayName : null,
      originalSender.login ? originalSender.login : null,
      originalSender.login ? `@${originalSender.login}` : null,
    ].filter(filterNulls);

    if (originalSenderNames.length < 1) {
      log("no original sender names!");
      return;
    }

    let resolvables: BeatSaverResolvable[] | null = null;
    const nonce = ulid();
    log(`(${nonce}) waiting for ${originalSenderNames.join(" or ")} on ${event.channel}`);

    const responseM = await waitForMessage((ctx, self) => {
      const { message, sender } = ctx;
      const _resolvables = findBeatSaverResolvables(message);
      const containsBeatSaverResolvable = _resolvables.resolvables.length > 0;
      if (!containsBeatSaverResolvable) return false;

      // Normal handler:
      const containsOriginalSendersName = originalSenderNames.some((name) => message.includes(name));
      if (!containsOriginalSendersName) {
        if (self.fallback === null) {
          // Handle special version of !link which is popular on JP streams
          // If it contains
          const repliedByModOrAbove = sender.role === ChannelRole.Moderator || sender.role === ChannelRole.Streamer;
          if (repliedByModOrAbove) {
            log(`(${nonce}) found fallback`);
            resolvables = _resolvables.resolvables;
            self.fallback = ctx;
          }
        }
        return false;
      }

      log(`(${nonce}) found`);
      resolvables = _resolvables.resolvables;
      return true;
    });
    await manager.ensureChannelAndJoinFromTwitchIRCMessage(event);
    if (responseM.isErr()) {
      console.error("The response timed out");
      return;
    }
    if (!resolvables) {
      console.error("Resolvables is null");
      return;
    }

    const comment = args.join(" ") ?? null;
    const preferredName = `@${originalSender.displayName ?? originalSender.login}`;
    const [resolvable] = resolvables as BeatSaverResolvable[];

    if (resolvable.kind === "id") {
      await db.ResendLinkTwitchBeatSaverResolvableIdKind.add({
        id: ulid(),
        deliveredAt: null,
        data: resolvable.data,
        status: "not delivered",

        targetId: makeBroadcasterId(event.user.id),
        sourceId: makeBroadcasterId(event.roomId),

        comment,
        targetLogin: event.user.login,
        sourceLogin: event.channel.split("#").join(""),
      });
    }

    return;
  });
};
