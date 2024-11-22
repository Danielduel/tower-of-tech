import { getDefaultHandler, getDefaultModuleHandler } from "@/packages/log/shared.ts";
import { getLogger, setup, state } from "@/packages/deps/log.ts";

setup({
  handlers: {
    ...state.config.handlers,
    console: getDefaultHandler(),
    TwitchPubSubConsole: getDefaultModuleHandler("TwitchPubSub"),
  },
  loggers: {
    ...state.config.loggers,
    "TwitchPubSub": {
      level: "DEBUG",
      handlers: ["TwitchPubSubConsole"],
    },
  },
});

export const getTwitchPubSubLogger = () => getLogger("TwitchPubSub");
