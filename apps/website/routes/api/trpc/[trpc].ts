import { Handlers } from "$fresh/server.ts";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/packages/trpc/router.ts";


const _handler: Handlers = {
    async GET(request, ctx) {
    console.log(`TRPC access: ${request.url}`)

    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: request,
      router: appRouter,
      createContext: () => ({
        request,
      }),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json"
      }
    })

    return response;
  },
};

export const handler: Handlers = {
  GET: _handler.GET,
  POST: _handler.GET,
  PATCH: _handler.GET
}
