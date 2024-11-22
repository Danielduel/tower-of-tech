import { getDefaultHandler, getDefaultModuleHandler } from "@/packages/log/shared.ts";
import { getLogger, setup, state } from "@/packages/deps/log.ts";

setup({
  handlers: {
    ...state.config.handlers,
    console: getDefaultHandler(),
    TwitchBotConsole: getDefaultModuleHandler("TwitchBot"),
  },
  loggers: {
    ...state.config.loggers,
    TwitchBot: {
      level: "DEBUG",
      handlers: ["TwitchBotConsole"],
    },
  },
});

export const getTwitchBotLogger = () => getLogger("TwitchBot");
