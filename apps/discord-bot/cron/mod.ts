import { createTechMultiEvent } from "./tech-multi/createTechMultiEvent.ts";
import { longReminder, shortReminder } from "@/apps/discord-bot/cron/tech-multi/reminders.ts";

export function registerCronJobs () {
  Deno.cron(
    "Tech multi event - schedule",
    "0 0 * * Fri",
    createTechMultiEvent,
  );

  Deno.cron(
    "Tech multi event - ping long reminder",
    "21 12 * * Thu",
    longReminder
  );

  Deno.cron(
    "Tech multi event - ping short reminder",
    "0 17 * * Thu",
    shortReminder
  );
};
