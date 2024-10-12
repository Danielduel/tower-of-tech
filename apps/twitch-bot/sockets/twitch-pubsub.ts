import { z } from "zod";
import { getTwitchPubSubLogger } from "@/packages/log/twitch-pubsub.ts";
import { MINUTE_MS } from "@/packages/utils/time.ts";
import { TwitchPubSubContext, TwitchPubSubEmitter } from "@/apps/twitch-bot/types.ts";
import { BroadcasterId, UserAccessToken } from "@/packages/api-twitch/helix/brand.ts";
import { tryParse } from "@/packages/utils/tryParse.ts";
import { zodParseStringAsDateSchema } from "@/packages/utils/zod.ts";
import { TwitchRedemptionSchema } from "@/apps/twitch-bot/sockets/twitch-schema.ts";

const logger = getTwitchPubSubLogger();

const sendCommand = (socket: WebSocket, commandType: string) => socket.send(JSON.stringify({ type: commandType }));
const sendPingCommand = (socket: WebSocket) => sendCommand(socket, "PING");
const sendListenCommand = (socket: WebSocket, channelId: string, topics: string[], authToken: UserAccessToken) => {
  const _topics = topics.map((x) => `${x}.${channelId}`);
  socket.send(
    JSON.stringify({
      type: "LISTEN",
      // nonce: "",
      data: { topics: _topics, auth_token: authToken },
    }),
  );
  return _topics;
};

const registerPingLoop = (emitter: TwitchPubSubEmitter, socket: WebSocket) => {
  logger.debug("register ping loop");
  let interval = -1;
  if (socket.readyState === 1) {
    logger.info("Registering ping loop directly");
    if (interval !== -1) {
      // shouldn't happen
      logger.info("Clean ping interval in direct open");
      clearInterval(interval);
    }
    interval = setInterval(() => {
      logger.info("Sending ping command");
      sendPingCommand(socket);
    }, 2 * MINUTE_MS);
  } else {
    emitter.on("socket_open", () => {
      if (interval !== -1) {
        // shouldn't happen
        logger.info("Clean ping interval in socket_open");
        clearInterval(interval);
      }

      logger.info("Registering ping loop in socket_open");
      interval = setInterval(() => {
        logger.info("Sending ping command");
        sendPingCommand(socket);
      }, 2 * MINUTE_MS);
    });
  }
  emitter.on("socket_close", () => {
    logger.info("Clean ping interval");
    if (interval !== -1) {
      clearInterval(interval);
    } else {
      logger.error("socket_close interval was invalid (-1)");
    }
  });
};

const pubSubTypeSchema = z.object({
  type: z.enum(["message"]),
  data: z.string().transform(tryParse),
});

const pubSubInnerTypeSchema = z.object({
  type: z.enum(["RESPONSE", "MESSAGE", "PONG"]),
  data: z.any(),
});

const pubSubTopicSchema = z.object({
  topic: z.string(),
  message: z.string().transform(tryParse),
});

const pubSubMessageSchema = z.object({
  type: z.string(),
  data: z.object({
    timestamp: zodParseStringAsDateSchema,
    status: z.enum(["UNFULFILLED", "FULFILLED"]).optional(),
    redemption: TwitchRedemptionSchema,
  }),
});

export const createTwitchPubSub = async (channelId: BroadcasterId, authToken: UserAccessToken) => {
  logger.debug("create");

  logger.debug("create emitter");
  const TwitchPubSubEmitterInstance = new TwitchPubSubEmitter();

  logger.debug("create connection");
  const wss = new WebSocket("wss://pubsub-edge.twitch.tv");

  wss.addEventListener("open", (event) => {
    logger.debug("Emit socket_open");
    TwitchPubSubEmitterInstance.emit("socket_open", { event });
  });
  wss.addEventListener("close", (event) => {
    logger.debug("Emit socket_close", event);
    TwitchPubSubEmitterInstance.emit("socket_close", { event });
  });
  wss.addEventListener("error", (event) => TwitchPubSubEmitterInstance.emit("socket_error", { event }));
  wss.addEventListener("message", (event) => {
    try {
      console.log("asdasdas", JSON.stringify(event));

      logger.info("pubSubTypeSchema");
      const _parsed = pubSubTypeSchema.parse(event);
      if (_parsed.data.isErr()) {
        logger.error("Type parser error");
        logger.error(_parsed.data.unwrapErr());
        return null;
      }

      logger.info("pubSubInnerTypeSchema");
      const __parsed = pubSubInnerTypeSchema.parse(_parsed.data.unwrap());

      // RESPONSE ends here
      const __parsedData = __parsed.data;
      if (!__parsedData) return null;

      logger.info("pubSubTopicSchema");
      console.log(__parsedData);
      const ___parsed = pubSubTopicSchema.parse(__parsedData);
      if (___parsed.message.isErr()) {
        logger.error("Inner type parser error");
        logger.error(___parsed.message.unwrapErr());
        return null;
      }
      const topic = ___parsed.topic;

      const innerData = ___parsed.message.unwrap();

      const pubSubRedeemData = pubSubMessageSchema.parse(innerData);
      logger.debug("Parsed");
      console.log(pubSubRedeemData);
      TwitchPubSubEmitterInstance.emit("reward_redeemed", {
        redemption: pubSubRedeemData.data.redemption,
        reward: pubSubRedeemData.data.redemption.reward,
        topic,
      });
    } catch (err) {
      logger.error("Message handler error");
      logger.error(err);
      return null;
    }
  });

  const listenTopics = (topics: string[]) => {
    const finalTopics = sendListenCommand(wss, channelId, topics, authToken);
  };

  const cleanup = () => {
    wss.close();
  };

  const context: TwitchPubSubContext = {
    socket: wss,
    listenTopics,
  };

  registerPingLoop(TwitchPubSubEmitterInstance, wss);
  await new Promise((r) => wss.addEventListener("open", () => r(null), { once: true }));

  return [TwitchPubSubEmitterInstance, cleanup, context] as const;
};
