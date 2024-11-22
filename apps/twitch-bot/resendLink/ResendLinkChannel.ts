import { getResendLinkLogger } from "@/apps/twitch-bot/resendLink/getResendLinkLogger.ts";
import { TwitchIRCEmitter, TwitchIRCEventContext } from "@/apps/twitch-bot/types.ts";
import { linkCommand } from "@/apps/twitch-bot/resendLink/linkCommand.ts";
import { resendLinkCommand } from "@/apps/twitch-bot/resendLink/resendLinkCommand.ts";
import { createTwitchIRC } from "@/apps/twitch-bot/sockets/twitch-irc.ts";
import { ResendLinkTwitchChannelSettingsFlatSchemaT } from "@/packages/types/resendLink.ts";
import { controlCommands } from "@/apps/twitch-bot/resendLink/controlCommands.ts";

const logger = getResendLinkLogger();
const nick = Deno.env.get("TWITCH_IRC_COMMANDS_LOGIN")!;
const pass = Deno.env.get("TWITCH_IRC_COMMANDS_PASS")!;

export class ResendLinkChannel {
  public log = (...args: unknown[]) => logger.debug(`${this.channelName} ${args.join(" ")}`);

  constructor(
    public readonly channelName: `#${string}`,
    public readonly irc: TwitchIRCEmitter,
    public readonly ircContext: TwitchIRCEventContext,
    public readonly ircCleanup: () => void,
    public settings?: ResendLinkTwitchChannelSettingsFlatSchemaT,
  ) {
    this.log("created");
    linkCommand(this.irc, this.log, this.settings);
    resendLinkCommand(this.irc, this.log, this.settings);
    controlCommands(this.irc, this.log, this.settings);
  }

  static createFromName(
    channelName: `#${string}`,
    settings?: ResendLinkTwitchChannelSettingsFlatSchemaT,
  ): ResendLinkChannel {
    const [irc, ircCleanup, ircContext] = createTwitchIRC({
      channel: channelName,
      debug: true,
      credentials: {
        nick,
        pass,
      },
    });

    return new ResendLinkChannel(channelName, irc, ircContext, ircCleanup, settings);
  }

  static createFromSettings(
    settings: ResendLinkTwitchChannelSettingsFlatSchemaT,
  ): ResendLinkChannel {
    const channelName: `#${string}` = `#${settings.twitchLogin}`;
    const [irc, ircCleanup, ircContext] = createTwitchIRC({
      channel: channelName,
      debug: true,
      credentials: {
        nick,
        pass,
      },
    });

    return new ResendLinkChannel(channelName, irc, ircContext, ircCleanup, settings);
  }
}
