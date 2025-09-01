import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET(_req, _ctx) {
    return Response.redirect(new URL(_req.url + "home"), 307)
  },
};
