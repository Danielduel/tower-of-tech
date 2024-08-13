import { getDefaultHandler, getDefaultModuleHandler } from "@/packages/log/shared.ts";
import { getLogger, setup } from "@/packages/log/deps.ts";

setup({
  handlers: {
    console: getDefaultHandler(),
    TwitchIRCConsole: getDefaultModuleHandler("TwitchIRC"),
  },
  loggers: {
    "TwitchIRC": {
      level: "DEBUG",
      handlers: ["TwitchIRCConsole"],
    },
  },
});

export const getTwitchIRCLogger = () => getLogger("TwitchIRC");
