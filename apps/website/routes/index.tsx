import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    const headers = new Headers({
      location: "/home",
    });
    return new Response(null, {
      status: 302,
      headers,
    });
  },
};
