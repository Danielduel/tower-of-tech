import { createTechMultiEvent } from "./tech-multi/createTechMultiEvent.ts";

export function registerCronJobs () {
  Deno.cron(
    "Reschedule tech multi event",
    "0 0 * * Fri",
    createTechMultiEvent,
  );
}
