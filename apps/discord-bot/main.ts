import { registerCronJobs } from "./cron/mod.ts";
import { registerServeHttp } from "./serveHttp.ts";

registerCronJobs();
registerServeHttp();
