import { EventEmitter } from "@/packages/deps/eventEmitter.ts";
import type { ClearChat } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/clearchat.ts";
import type { ClearMsg } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/clearmsg.ts";
import type { GlobalUserState } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/globaluserstate.ts";
import type { HostTarget } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/hosttarget.ts";
import type { Join } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/join.ts";
import type { Notice } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/notice.ts";
import type { Part } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/part.ts";
import type { Privmsg } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/privmsg.ts";
import type { Reconnect } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/reconnect.ts";
import type { RoomState } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/roomstate.ts";
import type { UserNotice } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/usernotice.ts";
import type { UserState } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/userstate.ts";
import type { Message } from "https://deno.land/x/twitch_irc@0.11.2/lib/message.ts";
import type { Channel as TwitchChannel } from "https://deno.land/x/twitch_irc@0.11.2/lib/base.ts";
import type { Client } from "jsr:@dduel/twitch-irc@0.11.4";
import type {
eventSubNotificationPayloadSchema_CustomRewardRedeem_EventT,
eventSubNotificationPayloadSchema_ChannelRaid_EventT,
EventSubWelcomeInnerTypeSchemaT,
eventSubNotificationPayloadSchema_ChannelFollow_EventT,
} from "@/apps/twitch-bot/sockets/twitch-schema.ts";
import {
  PromiseMessageManagerWaitForResult,
  PromiseMessageManagerWaitForT,
} from "@/packages/api-twitch/utils/PromiseMessageManager.ts";

export type { TwitchChannel };

export type ChatEventData = {
  open: void;
  close: void;
  error: unknown;
  privmsg: Privmsg;
  userstate: UserState;
  join: Join;
  part: Part;
  clearchat: ClearChat;
  clearmsg: ClearMsg;
  globaluserstate: GlobalUserState;
  hosttarget: HostTarget;
  reconnect: Reconnect;
  usernotice: UserNotice;
  notice: Notice;
  roomstate: RoomState;
  raw: Message;
};

export const Events = [
  "open",
  "close",
  "error",
  "privmsg",
  "userstate",
  "join",
  "part",
  "clearchat",
  "clearmsg",
  "globaluserstate",
  "hosttarget",
  "reconnect",
  "usernotice",
  "notice",
  "roomstate",
  "raw",
] as const;

export type TwitchIRCEventContext = {
  joined: boolean;
  waitForJoin: Promise<void>;
  channel: TwitchChannel;
  client: Client;
  send: (message: string) => {
    confirm: () => PromiseMessageManagerWaitForResult;
  };
  waitForMessage: PromiseMessageManagerWaitForT;
};

type TwitchIRCEventHandlerOpts<T> = [{
  event: T;
  context: TwitchIRCEventContext;
}];

export type TwitchIRCEvents = {
  open: TwitchIRCEventHandlerOpts<ChatEventData["open"]>;
  close: TwitchIRCEventHandlerOpts<ChatEventData["close"]>;
  error: TwitchIRCEventHandlerOpts<ChatEventData["error"]>;
  privmsg: TwitchIRCEventHandlerOpts<ChatEventData["privmsg"]>;
  userstate: TwitchIRCEventHandlerOpts<ChatEventData["userstate"]>;
  join: TwitchIRCEventHandlerOpts<ChatEventData["join"]>;
  part: TwitchIRCEventHandlerOpts<ChatEventData["part"]>;
  clearchat: TwitchIRCEventHandlerOpts<ChatEventData["clearchat"]>;
  clearmsg: TwitchIRCEventHandlerOpts<ChatEventData["clearmsg"]>;
  globaluserstate: TwitchIRCEventHandlerOpts<ChatEventData["globaluserstate"]>;
  hosttarget: TwitchIRCEventHandlerOpts<ChatEventData["hosttarget"]>;
  reconnect: TwitchIRCEventHandlerOpts<ChatEventData["reconnect"]>;
  usernotice: TwitchIRCEventHandlerOpts<ChatEventData["usernotice"]>;
  notice: TwitchIRCEventHandlerOpts<ChatEventData["notice"]>;
  roomstate: TwitchIRCEventHandlerOpts<ChatEventData["roomstate"]>;
  raw: TwitchIRCEventHandlerOpts<ChatEventData["raw"]>;
};

export class TwitchIRCEmitter extends EventEmitter<TwitchIRCEvents> {}

type TwitchPubSubEventData = {
  socket_open: Event;
  socket_close: CloseEvent;
  socket_error: Event;
  pong: void;
  reconnect: void;
};

type TwitchPubSubEventHandlerOpts<T> = [{
  event: T;
}];

export type TwitchPubSubEvents = {
  socket_open: TwitchPubSubEventHandlerOpts<TwitchPubSubEventData["socket_open"]>;
  socket_close: TwitchPubSubEventHandlerOpts<TwitchPubSubEventData["socket_close"]>;
  socket_error: TwitchPubSubEventHandlerOpts<TwitchPubSubEventData["socket_error"]>;
  pong: TwitchPubSubEventHandlerOpts<TwitchPubSubEventData["pong"]>;
  reconnect: TwitchPubSubEventHandlerOpts<TwitchPubSubEventData["reconnect"]>;
  reward_redeemed: TwitchPubSubEventHandlerOpts<eventSubNotificationPayloadSchema_CustomRewardRedeem_EventT>;
  channel_raid: TwitchPubSubEventHandlerOpts<eventSubNotificationPayloadSchema_ChannelRaid_EventT>;
  channel_follow: TwitchPubSubEventHandlerOpts<eventSubNotificationPayloadSchema_ChannelFollow_EventT>;
};

export class TwitchPubSubEmitter extends EventEmitter<TwitchPubSubEvents> {}

export type TwitchPubSubContext = {
  socket: WebSocket;
  listenTopics: (topics: string[]) => void;
  websocketSession: EventSubWelcomeInnerTypeSchemaT;
};
