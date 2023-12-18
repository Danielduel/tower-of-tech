import { respondWithMessage } from "@/apps/discord-bot/commands/utils.ts";

export function executePing() {
  return respondWithMessage("Pong");
}
