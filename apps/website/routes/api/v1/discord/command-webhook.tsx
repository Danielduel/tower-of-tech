import { Handlers } from "$fresh/server.ts";
import { commandRoot } from "@/packages/discord/commands/mod.ts";

export const handler: Handlers = {
  async GET(req) {
    return await commandRoot(req);
  },
};

