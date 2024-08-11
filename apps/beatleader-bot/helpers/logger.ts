import { ConsoleHandler, getLogger, setup } from "https://deno.land/std@0.224.0/log/mod.ts";

setup({
  handlers: {
    console: new ConsoleHandler("DEBUG"),
    WSGeneralConsole: new ConsoleHandler("DEBUG", {
      formatter: (record) => `[WSGeneral] [${record.levelName}] [${record.datetime.toLocaleString()}] ${record.msg}`,
    }),
  },
  loggers: {
    "WSGeneral": {
      level: "DEBUG",
      handlers: ["WSGeneralConsole"],
    },
  },
});

export { getLogger };
