import { getDefaultHandler, getDefaultModuleHandler } from "@/packages/log/shared.ts";
import { getLogger, setup } from "@/packages/deps/log.ts";

setup({
  handlers: {
    console: getDefaultHandler(),
    TwitchBotConsole: getDefaultModuleHandler("TwitchBot"),
  },
  loggers: {
    TwitchBot: {
      level: "DEBUG",
      handlers: ["TwitchBotConsole"],
    },
  },
});

export const getTwitchBotLogger = () => getLogger("TwitchBot");
