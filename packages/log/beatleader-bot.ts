import { getDefaultHandler, getDefaultModuleHandler } from "@/packages/log/shared.ts";
import { getLogger, setup } from "@/packages/deps/log.ts";

setup({
  handlers: {
    console: getDefaultHandler(),
    WSGeneralConsole: getDefaultModuleHandler("WSGeneral"),
  },
  loggers: {
    "WSGeneral": {
      level: "DEBUG",
      handlers: ["WSGeneralConsole"],
    },
  },
});

export const getWSGeneralLogger = () => getLogger("WSGeneral");
