import { getTwitchPubSubLogger } from "@/packages/log/twitch-pubsub.ts";
import { MINUTE_MS } from "@/packages/utils/time.ts";
import { TwitchPubSubContext, TwitchPubSubEmitter } from "@/apps/twitch-bot/types.ts";
import { BroadcasterId, UserAccessToken } from "@/packages/api-twitch/helix/brand.ts";
import {
  eventSubInnerTypeGenericSchema,
  eventSubInnerTypeNotificationSchema,
  eventSubTypeSchema,
  eventSubWelcomeInnerTypeSchema,
  EventSubWelcomeInnerTypeSchemaT,
  eventSubWelcomeTypeSchema,
} from "@/apps/twitch-bot/sockets/twitch-schema.ts";

const logger = getTwitchPubSubLogger();

const sendCommand = (socket: WebSocket, commandType: string) => socket.send(JSON.stringify({ type: commandType }));
const sendPingCommand = (socket: WebSocket) => sendCommand(socket, "PING");

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

export const createTwitchEventSub = async (channelId: BroadcasterId, authToken: UserAccessToken) => {
  logger.debug("create");

  const setupWelcomePromise = Promise.withResolvers<EventSubWelcomeInnerTypeSchemaT>();

  logger.debug("create emitter");
  const TwitchPubSubEmitterInstance = new TwitchPubSubEmitter();

  logger.debug("create connection");
  const wss = new WebSocket("wss://eventsub.wss.twitch.tv/ws");

  wss.addEventListener("open", (event) => {
    logger.debug("Emit socket_open");
    TwitchPubSubEmitterInstance.emit("socket_open", { event });
  });
  wss.addEventListener("close", (event) => {
    logger.debug("Emit socket_close", event);
    TwitchPubSubEmitterInstance.emit("socket_close", { event });
  });
  wss.addEventListener("error", (event) => TwitchPubSubEmitterInstance.emit("socket_error", { event }));

  const handleNotificationMessage = (event: MessageEvent<unknown>) => {
    logger.info("eventSubTypeSchema");
    const _parsed = eventSubTypeSchema.parse(event);
    if (_parsed.data.isErr()) {
      logger.error("Type parser error");
      logger.error(_parsed.data.unwrapErr());
      return null;
    }

    const _parsedDataUnwrap = _parsed.data.unwrap();
    logger.info("eventSubInnerTypeSchema");
    console.log("event", _parsedDataUnwrap);
    const __parsed = eventSubInnerTypeGenericSchema.parse(_parsedDataUnwrap);
    console.log(__parsed);

    switch (__parsed.metadata.message_type) {
      case "notification":
        const {
          // metadata,
          payload: {
            event,
            // subscription,
          },
        } = eventSubInnerTypeNotificationSchema.parse(_parsedDataUnwrap);
        const reward = {
          cost: event.reward.cost,
          prompt: event.reward.prompt,
          title: event.reward.title,
          is_enabled: true,
          id: event.reward.id,
          background_color: "",
          channel_id: event.broadcaster_user_id,
          global_cooldown: { is_enabled: false, global_cooldown_seconds: 0 },
          is_in_stock: true,
          is_paused: false,
          is_sub_only: false,
          is_user_input_required: false,
          max_per_stream: { is_enabled: false, max_per_stream: 0 },
          max_per_user_per_stream: { is_enabled: false, max_per_user_per_stream: 0 },
          should_redemptions_skip_request_queue: false,
          cooldown_expires_at: null,
          default_image: null,
          image: null,
          redemptions_redeemed_current_stream: null,
          template_id: null,
          updated_for_indicator_at: undefined,
        };

        TwitchPubSubEmitterInstance.emit("reward_redeemed", {
          reward,
          redemption: {
            reward,
            channel_id: event.broadcaster_user_id,
            id: event.id,
            user: {
              id: event.user_id,
              display_name: event.user_name,
              login: event.user_login,
            },
            redeemed_at: event.redeemed_at
          },
          topic: reward.title
        });
    }
  };

  const handleWelcomeMessage = (event: MessageEvent<unknown>) => {
    try {
      logger.info("eventSubTypeSchema");
      const _parsed = eventSubWelcomeTypeSchema.parse(event);
      if (_parsed.data.isErr()) {
        logger.error("Type parser error");
        logger.error(_parsed.data.unwrapErr());
        return null;
      }

      const _parsedDataUnwrap = _parsed.data.unwrap();
      logger.info("eventSubInnerTypeSchema");
      const __parsed = eventSubWelcomeInnerTypeSchema.parse(_parsedDataUnwrap);

      if (__parsed.payload.session.status === "connected") {
        logger.info("connected");
        setupWelcomePromise.resolve(__parsed);
        wss.removeEventListener("message", handleWelcomeMessage);
        wss.addEventListener("message", handleNotificationMessage);
      }
    } catch (err) {
      logger.error("Message handler error");
      logger.error(err);
      return null;
    }
  };

  wss.addEventListener("message", handleWelcomeMessage);

  const cleanup = () => {
    wss.close();
  };

  registerPingLoop(TwitchPubSubEmitterInstance, wss);

  await new Promise((r) => wss.addEventListener("open", () => r(null), { once: true }));
  const sessionWelcomeData = await setupWelcomePromise.promise;

  const context: TwitchPubSubContext = {
    socket: wss,
    websocketSession: sessionWelcomeData,
  };

  return [TwitchPubSubEmitterInstance, cleanup, context] as const;
};
