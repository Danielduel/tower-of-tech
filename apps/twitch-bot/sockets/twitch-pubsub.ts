import { getTwitchPubSubLogger } from "@/packages/log/twitch-pubsub.ts";
import { MINUTE_MS } from "@/packages/utils/time.ts";
import { TwitchPubSubEmitter } from "@/apps/twitch-bot/types.ts";

const logger = getTwitchPubSubLogger();

const sendCommand = (socket: WebSocket, commandType: string) => socket.send(JSON.stringify({ type: commandType }));
const sendPingCommand = (socket: WebSocket) => sendCommand(socket, "PING");
const sendListenCommand = (socket: WebSocket, topic: string) => sendCommand(socket, "LISTEN");

const registerPingLoop = (emitter: TwitchPubSubEmitter, socket: WebSocket) => {
  logger.debug("register ping loop");
  let interval = -1;
  emitter.on("socket_open", () => {
    if (interval !== -1) {
      // shouldn't happen
      clearInterval(interval);
    }
    interval = setInterval(() => {
      sendPingCommand(socket);
    }, 4 * MINUTE_MS);
  });
  emitter.on("socket_close", () => {
    if (interval !== -1) {
      clearInterval(interval);
    } else {
      logger.error("socket_close interval was -1");
    }
  });
};

export const createTwitchPubSub = () => {
  logger.debug("create");

  logger.debug("create emitter");
  const TwitchPubSubEmitterInstance = new TwitchPubSubEmitter();

  logger.debug("create connection");
  const wss = new WebSocket("wss://pubsub-edge.twitch.tv");

  wss.addEventListener("open", (event) => TwitchPubSubEmitterInstance.emit("socket_open", { event }));
  wss.addEventListener("close", (event) => TwitchPubSubEmitterInstance.emit("socket_close", { event }));
  wss.addEventListener("error", (event) => TwitchPubSubEmitterInstance.emit("socket_error", { event }));

  registerPingLoop(TwitchPubSubEmitterInstance, wss);
};
