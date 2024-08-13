import { Client } from "https://deno.land/x/twitch_irc@0.11.2/mod.ts";
import { getTwitchIRCLogger } from "@/packages/log/twitch-irc.ts";
import {
  TwitchChannel,
  TwitchIRCEmitter,
  TwitchIRCEventContext,
  TwitchIRCEvents,
} from "@/apps/twitch-irc-bot/types.ts";

type CreateTwitchIRCOpts = {
  debug: boolean;
  credentials: {
    nick: string;
    pass: string;
  };
  channel: TwitchChannel;
};

const logger = getTwitchIRCLogger();

export const createTwitchIRC = ({ debug, credentials, channel }: CreateTwitchIRCOpts) => {
  logger.debug("create");

  const _debug = (...args: unknown[]) =>
    logger.debug(`${channel} ${credentials.nick} ${args.filter((x) => x && typeof x === "string")}`);

  _debug("create emitter");
  const TwitchIRCEmitterInstance = new TwitchIRCEmitter();

  _debug("create client");
  const client = new Client({
    // @ts-ignore: wtf typescript
    credentials,
  });

  const defaultEventHandler =
    <Type extends keyof TwitchIRCEvents>(eventName: Type) =>
    (emit: (eventName: Type, e: TwitchIRCEvents[Type][0]["event"]) => Promise<void>) =>
      [
        eventName,
        (e: TwitchIRCEvents[Type][0]["event"]) => {
          _debug(`${eventName} start`, e);
          emit(eventName, e);
          _debug(`${eventName} end`);
        },
      ] as const;

  const context: TwitchIRCEventContext = {
    channel,
    client,
    send: (message) => client.privmsg(channel, message),
  };

  client.on(...defaultEventHandler("clearchat")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(...defaultEventHandler("clearmsg")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(...defaultEventHandler("close")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(...defaultEventHandler("error")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(
    ...defaultEventHandler("globaluserstate")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })),
  );
  client.on(...defaultEventHandler("hosttarget")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(...defaultEventHandler("join")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(...defaultEventHandler("notice")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(...defaultEventHandler("part")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(...defaultEventHandler("privmsg")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(...defaultEventHandler("raw")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(...defaultEventHandler("reconnect")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(...defaultEventHandler("roomstate")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(...defaultEventHandler("usernotice")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(...defaultEventHandler("userstate")((en, e) => TwitchIRCEmitterInstance.emit(en, { event: e, context })));
  client.on(
    ...defaultEventHandler("open")((en, e) => {
      client.join(channel);
      return TwitchIRCEmitterInstance.emit(en, { event: e, context });
    }),
  );

  const cleanup = () => {
    client.part(channel);
  };

  return [TwitchIRCEmitterInstance, cleanup] as const;
};
