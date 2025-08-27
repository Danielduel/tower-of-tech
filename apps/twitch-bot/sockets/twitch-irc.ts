import { Client } from "jsr:@dduel/twitch-irc@0.11.4";
import { getTwitchIRCLogger } from "@/packages/log/twitch-irc.ts";
import { TwitchChannel, TwitchIRCEmitter, TwitchIRCEventContext, TwitchIRCEvents } from "@/apps/twitch-bot/types.ts";
import { PromiseMessageManager } from "@/packages/api-twitch/utils/PromiseMessageManager.ts";

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
  let _joined = false;
  const _joinedP = Promise.withResolvers<void>();

  const _debug = (...args: unknown[]) => logger.debug(`${channel} ${credentials.nick} ${args.join(" ")}`);

  _debug("create PromiseMessageManager");
  const promiseMessageManager = new PromiseMessageManager();
  _debug("create TwitchIRCEmitter");
  const TwitchIRCEmitterInstance = new TwitchIRCEmitter();

  _debug("create Client");
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
          // _debug(`${eventName} start`, e);
          emit(eventName, e);
          // _debug(`${eventName} end`);
        },
      ] as const;

  const confirmSend = (message: string) => () => {
    return promiseMessageManager.waitFor((x) => x.message === message && x.sender.login === credentials.nick);
  };

  const send = (message: string) => {
    client.privmsg(channel, message);
    return {
      confirm: confirmSend(message),
    };
  };

  const context: TwitchIRCEventContext = {
    get joined() {
      return _joined;
    },
    get waitForJoin() {
      return _joinedP.promise;
    },
    channel,
    client,
    send,
    waitForMessage: promiseMessageManager.waitFor,
  };

  _debug("register PromiseMessageManager hook");
  TwitchIRCEmitterInstance.on("privmsg", (e) => {
    return promiseMessageManager.attemptResolve({
      message: e.event.message,
      sender: e.event.user,
    });
  });

  TwitchIRCEmitterInstance.on("join", (e) => {
    if (!_joined) {
      if (e.event.user === credentials.nick) {
        _debug("irc joined");
        _joined = true;
        _joinedP.resolve();
      }
    }
  });

  TwitchIRCEmitterInstance.on("notice", (e) => {
    // console.log(e.event);
  });

  TwitchIRCEmitterInstance.on("close", () => _debug("emitted closed"))
  TwitchIRCEmitterInstance.on("reconnect", () => _debug("emitted reconnect"))
  TwitchIRCEmitterInstance.on("error", () => _debug("emitted error"))

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

  return [TwitchIRCEmitterInstance, cleanup, context] as const;
};
