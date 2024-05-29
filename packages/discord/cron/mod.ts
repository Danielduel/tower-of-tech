import { createTechMultiEvent } from "@/packages/discord/cron/tech-multi/createTechMultiEvent.ts";
import {
  techMultiJoke,
  techMultiLongReminder,
  techMultiShortReminder,
} from "@/packages/discord/cron/tech-multi/reminders.ts";

export function registerDiscordCronJobs() {
  Deno.cron(
    "Tech multi event - schedule",
    "0 0 * * Fri",
    createTechMultiEvent,
  );

  Deno.cron(
    "Tech multi event - ping long reminder",
    "0 8 * * Thu",
    techMultiLongReminder,
  );

  Deno.cron(
    "Tech multi event - ping short reminder",
    "0 17 * * Thu",
    techMultiShortReminder,
  );

  Deno.cron(
    "Tech multi event - daily joke",
    "0 7 * * *",
    techMultiJoke,
  );
}
