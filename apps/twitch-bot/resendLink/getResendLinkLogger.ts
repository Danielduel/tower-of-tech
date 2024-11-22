import { getDefaultHandler, getDefaultModuleHandler } from "@/packages/log/shared.ts";
import { getLogger, setup, state } from "@/packages/deps/log.ts";

setup({
  handlers: {
    ...state.config.handlers,
    console: getDefaultHandler(),
    ResendLinkConsole: getDefaultModuleHandler("ResendLink"),
  },
  loggers: {
    ...state.config.loggers,
    "ResendLink": {
      level: "DEBUG",
      handlers: ["ResendLinkConsole"],
    },
  },
});

export const getResendLinkLogger = () => getLogger("ResendLink");
