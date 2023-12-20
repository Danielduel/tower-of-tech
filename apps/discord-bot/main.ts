import { registerCronJobs } from "@/apps/discord-bot/cron/mod.ts";
import { registerServeHttp } from "@/apps/discord-bot/serveHttp.ts";

registerCronJobs();
registerServeHttp();
