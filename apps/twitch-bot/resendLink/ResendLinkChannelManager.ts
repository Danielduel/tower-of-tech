import { ResendLinkChannel } from "@/apps/twitch-bot/resendLink/ResendLinkChannel.ts";
import { BroadcasterId, makeBroadcasterId } from "@/packages/api-twitch/helix/brand.ts";
import { ResendLinkTwitchChannelSettingsFlatSchemaT } from "@/packages/types/resendLink.ts";
import { Privmsg } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/privmsg.ts";
import { dbEditor } from "@/packages/database-editor/mod.ts";
import { HelixSearchChannelsItemSchemaT } from "@/packages/api-twitch/helix/helixSearchChannels.ts";

export class ResendLinkChannelManager {
  block: boolean = false;
  resendLinkChannels: Map<BroadcasterId, ResendLinkChannel> = new Map();

  cleanup() {
    this.block = true;
    console.log(`Cleanup start`);
    for (const x of this.resendLinkChannels.values()) {
      console.log(`Cleanup ${x.channelName}`);
      x.ircCleanup();
    }
    console.log(`Cleanup finished`);
  }

  ensureJoinedChannelFromSettings(settings: ResendLinkTwitchChannelSettingsFlatSchemaT) {
    if (this.block) return;

    const { twitchId } = settings;

    if (this.resendLinkChannels.has(twitchId)) return;

    const channel = ResendLinkChannel.createFromSettings(settings);
    this.resendLinkChannels.set(twitchId, channel);
    return channel;
  }

  async ensureChannelSettingsFromMessage(
    twitchId: BroadcasterId,
    message: Privmsg,
  ): Promise<ResendLinkTwitchChannelSettingsFlatSchemaT> {
    return await this.ensureChannelSettings({
      twitchId,
      twitchLogin: message.user.login,
      twitchName: message.user.displayName ?? "",
    });
  }

  async ensureChannelSettings({
    twitchId,
    twitchLogin,
    twitchName,
  }: Pick<ResendLinkTwitchChannelSettingsFlatSchemaT, "twitchId" | "twitchLogin" | "twitchName">): Promise<
    ResendLinkTwitchChannelSettingsFlatSchemaT
  > {
    const settings = await dbEditor.ResendLinkTwitchChannelSettings.find(twitchId);

    if (settings) return settings.value;

    const defaults = {
      enabled: true,

      linkCommand: "!link",
      linkEnabled: true,

      parentId: null,

      resendCommand: "!!",
      resendEnabled: true,
      resendRequestCommand: "!bsr ",

      twitchId: twitchId,
      twitchLogin,
      twitchName,
    } satisfies ResendLinkTwitchChannelSettingsFlatSchemaT;
    console.log(
      `Creating ResendLinkTwitchChannelSettings for ${defaults.twitchLogin}, ${defaults.twitchName} under ${defaults.twitchId}`,
    );

    const newSettings = await dbEditor.ResendLinkTwitchChannelSettings.add(defaults);

    if (!newSettings.ok) {
      throw `Can't add user ${defaults.twitchLogin}, ${defaults.twitchName} under ${defaults.twitchId}`;
    }

    return defaults;
  }

  async ensureChannelAndJoinFromTwitchIRCMessage(message: Privmsg) {
    const twitchId = makeBroadcasterId(message.user.id);

    if (this.resendLinkChannels.has(twitchId)) return;

    const settings = await this.ensureChannelSettingsFromMessage(twitchId, message);

    this.ensureJoinedChannelFromSettings(settings);
    return;
  }

  async ensureChannelAndJoinFromTwitchChannel(channel: HelixSearchChannelsItemSchemaT) {
    if (this.resendLinkChannels.has(channel.id)) return;

    const settings = await this.ensureChannelSettings({
      twitchId: channel.id,
      twitchLogin: channel.broadcaster_login,
      twitchName: channel.display_name,
    });

    this.ensureJoinedChannelFromSettings(settings);
    return;
  }
}
