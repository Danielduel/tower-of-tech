import { EventEmitter } from "https://deno.land/x/event@2.0.1/mod.ts";
import { BeatLeaderGeneralSocketAccepted, BeatLeaderGeneralSocketAny } from "@/apps/beatleader-bot/beatleader-zod.ts";
import { getWSGeneralLogger } from "@/packages/log/beatleader-bot.ts";
import { tryParse } from "@/packages/utils/tryParse.ts";

type WSGeneralEvents = {
  open: [any];
  error: [any];
  close: [any];
  upload: [any];
  rejected: [any];
  accepted: [typeof BeatLeaderGeneralSocketAccepted["_type"]];
  accepted_errorParse: [any];
  message_errorParse: [any, any];
};

class WSGeneralEmitter extends EventEmitter<WSGeneralEvents> {}

type CreateBeatleaderWSGeneralOpts = {
  debug: boolean;
};

const logger = getWSGeneralLogger();

export const createBeatleaderWSGeneral = ({ debug }: CreateBeatleaderWSGeneralOpts) => {
  logger.debug("create");

  const addr = "wss://sockets.api.beatleader.xyz/general";
  logger.debug("create WebSocket");
  const ws = new WebSocket(addr);

  logger.debug("create emitter");
  const WSGeneralEmitterInstance = new WSGeneralEmitter();

  logger.debug("register onopen event handler");
  ws.onopen = (...data: unknown[]) => {
    logger.debug("onopen start", data);
    WSGeneralEmitterInstance.emit("open", data);
    logger.debug("onopen end");
  };

  logger.debug("register onerror event handler");
  ws.onerror = (...data: unknown[]) => {
    logger.debug("onerror start", data);
    WSGeneralEmitterInstance.emit("error", data);
    logger.debug("onerror end");
  };

  logger.debug("register onclose event handler");
  ws.onclose = (...data: unknown[]) => {
    logger.debug("onclose start", data);
    WSGeneralEmitterInstance.emit("close", data);
    logger.debug("onclose end");
  };

  ws.onmessage = (event, ...data: unknown[]) => {
    logger.debug("onmessage start", event, data);
    try {
      logger.debug("onmessage tryParse start");
      const parsedEventData = tryParse(event.data);
      logger.debug("onmessage tryParse result", parsedEventData);

      logger.debug("onmessage BeatLeaderGeneralSocketAny parse start");
      const parsedEventDataAny = BeatLeaderGeneralSocketAny.parse(parsedEventData.unwrap());
      logger.debug("onmessage BeatLeaderGeneralSocketAny result", parsedEventDataAny);

      logger.debug("onmessage message type", parsedEventDataAny.message);
      switch (parsedEventDataAny.message) {
        case "accepted":
          logger.debug("onmessage switch accepted");
          try {
            return WSGeneralEmitterInstance.emit("accepted", BeatLeaderGeneralSocketAccepted.parse(parsedEventDataAny));
          } catch (err) {
            logger.debug("onmessage switch accepted catch block", err);
            return WSGeneralEmitterInstance.emit(
              "accepted_errorParse",
              BeatLeaderGeneralSocketAccepted.parse(parsedEventDataAny),
            );
          }
        case "upload":
          logger.debug("onmessage switch upload");
          return WSGeneralEmitterInstance.emit("upload", parsedEventDataAny);
        case "rejected":
          logger.debug("onmessage switch rejected");
          return WSGeneralEmitterInstance.emit("rejected", parsedEventDataAny);
      }
    } catch (err) {
      logger.debug("onmessage catch");
      return WSGeneralEmitterInstance.emit("message_errorParse", data, err);
    }
  };

  return WSGeneralEmitterInstance;
};
