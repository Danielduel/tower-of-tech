import { getDefaultHandler, getDefaultModuleHandler } from "@/packages/log/shared.ts";
import { getLogger, setup, state } from "@/packages/deps/log.ts";

setup({
  handlers: {
    ...state.config.handlers,
    console: getDefaultHandler(),
    WSGeneralConsole: getDefaultModuleHandler("WSGeneral"),
  },
  loggers: {
    ...state.config.loggers,
    "WSGeneral": {
      level: "DEBUG",
      handlers: ["WSGeneralConsole"],
    },
  },
});

export const getWSGeneralLogger = () => getLogger("WSGeneral");
