import Logger from "https://deno.land/x/logger@v1.1.1/logger.ts";
import type { Logger as ZodApiLogger } from "https://deno.land/x/zod_api@v0.3.1/mod.ts";

const sessionTimestamp = Date.now();


const getLogger = async (): Promise<ZodApiLogger> => {
  const logger = new Logger;
  await logger.initFileLogger(`./log/${sessionTimestamp}`);
  logger.disableConsole();

  return {
    debug: (d) => logger.info(d),
    trace: () => {},
    error: (e) => logger.error(e),
    info: (i) => logger.info(i),
    warn: (w) => logger.warn(w),
  };
}

export { getLogger };