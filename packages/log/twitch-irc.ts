import { getDefaultHandler, getDefaultModuleHandler } from "@/packages/log/shared.ts";
import { getLogger, setup, state } from "@/packages/deps/log.ts";

setup({
  handlers: {
    ...state.config.handlers,
    console: getDefaultHandler(),
    TwitchIRCConsole: getDefaultModuleHandler("TwitchIRC"),
  },
  loggers: {
    ...state.config.loggers,
    "TwitchIRC": {
      level: "DEBUG",
      handlers: ["TwitchIRCConsole"],
    },
  },
});

export const getTwitchIRCLogger = () => getLogger("TwitchIRC");
