import Logger from "https://deno.land/x/logger@v1.1.3/logger.ts";
import type { Logger as ZodApiLogger } from "zod-api";

const sessionTimestamp = Date.now();
const canWriteToFs = (() => {
  try {
    Deno.mkdirSync("./log", { recursive: true });
    return true;
  } catch {
    return false;
  }
})();

const getLogger = async (): Promise<ZodApiLogger> => {
  const logger = new Logger();

  if (canWriteToFs) {
    await logger.initFileLogger(`./log/${sessionTimestamp}`);
    logger.disableConsole();
  }

  return {
    debug: (d) => logger.info(d),
    trace: () => {},
    error: (e) => logger.error(e),
    info: (i) => logger.info(i),
    warn: (w) => logger.warn(w),
  };
};

export { getLogger };
