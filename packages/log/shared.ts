import { ConsoleHandler } from "@/packages/log/deps.ts";

export const getDefaultHandler = () => new ConsoleHandler("DEBUG");
export const getDefaultModuleHandler = (moduleName: string) => (
  new ConsoleHandler("DEBUG", {
    formatter: (record) => `[${moduleName}] [${record.levelName}] [${record.datetime.toLocaleString()}] ${record.msg}`,
    useColors: true,
  })
);
