import { respondWithMessage } from "@/packages/discord/commands/utils.ts";

export function executePing() {
  return respondWithMessage("Pong");
}
