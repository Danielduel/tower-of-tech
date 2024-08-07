import { EventEmitter } from "https://deno.land/x/event@2.0.1/mod.ts";
import { BeatLeaderGeneralSocketAccepted, BeatLeaderGeneralSocketAny } from "@/apps/beatleader-bot/beatleader-zod.ts";
import { Err, Ok } from "@/apps/beatleader-bot/deps.ts";

type WSGeneralEvents = {
  open: [any];
  error: [any];
  close: [any];
  upload: [any];
  accepted: [typeof BeatLeaderGeneralSocketAccepted["_type"]];
  accepted_errorParse: [any];
  message_errorParse: [any, any];
};

const tryParse = (data: string) => {
  try {
    return Ok(JSON.parse(data));
  } catch (_) {
    return Err("Error parsing");
  }
};

class WSGeneralEmitter extends EventEmitter<WSGeneralEvents> {}

export const createBeatleaderWSGeneral = () => {
  const addr = "wss://sockets.api.beatleader.xyz/general";
  const ws = new WebSocket(addr);
  const WSGeneralEmitterInstance = new WSGeneralEmitter();

  ws.onopen = (...data: unknown[]) => {
    WSGeneralEmitterInstance.emit("open", data);
  };

  ws.onerror = (...data: unknown[]) => {
    WSGeneralEmitterInstance.emit("error", data);
  };

  ws.onclose = (...data: unknown[]) => {
    WSGeneralEmitterInstance.emit("close", data);
  };

  ws.onmessage = (event, ...data: unknown[]) => {
    try {
      const parsedEventData = tryParse(event.data);
      const parsedEventDataAny = BeatLeaderGeneralSocketAny.parse(parsedEventData.unwrap());

      switch (parsedEventDataAny.message) {
        case "accepted":
          try {
            return WSGeneralEmitterInstance.emit("accepted", BeatLeaderGeneralSocketAccepted.parse(parsedEventDataAny));
          } catch (_) {
            return WSGeneralEmitterInstance.emit(
              "accepted_errorParse",
              BeatLeaderGeneralSocketAccepted.parse(parsedEventDataAny),
            );
          }
        case "upload":
          return WSGeneralEmitterInstance.emit("upload", parsedEventDataAny);
      }
    } catch (err) {
      return WSGeneralEmitterInstance.emit("message_errorParse", data, err);
    }
  };

  return WSGeneralEmitterInstance;
};
