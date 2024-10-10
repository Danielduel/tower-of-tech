import { getDefaultHandler, getDefaultModuleHandler } from "@/packages/log/shared.ts";
import { getLogger, setup } from "@/packages/deps/log.ts";

setup({
  handlers: {
    console: getDefaultHandler(),
    TwitchPubSubConsole: getDefaultModuleHandler("TwitchPubSub"),
  },
  loggers: {
    "TwitchPubSub": {
      level: "DEBUG",
      handlers: ["TwitchPubSubConsole"],
    },
  },
});

export const getTwitchPubSubLogger = () => getLogger("TwitchPubSub");
