import { renderToReadableStream } from "react-dom/server";
import { createCompilerHandler } from "ultra/lib/react/compiler.ts";
import { createRenderHandler } from "ultra/lib/react/renderer.ts";
import UltraServer from "ultra/lib/react/server.js";
import { readImportMap } from "ultra/lib/utils/import-map.ts";
import { createStaticHandler } from "ultra/lib/static/handler.ts";
import { composeHandlers } from "ultra/lib/handler.ts";
import { refresh } from "https://deno.land/x/refresh@1.0.0/mod.ts";
import { serve } from "https://deno.land/std@0.176.0/http/server.ts";
import { StaticRouter } from "react-router-dom/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc/router.ts";
import { TRPCServerProvider } from "@/trpc/server.tsx";

import Shell from "./shell.tsx";

const root = Deno.cwd();

const importMap = Deno.env.get("ULTRA_MODE") === "development"
  ? await readImportMap("./importMap.dev.json")
  : await readImportMap("./importMap.json");

const renderer = createRenderHandler({
  root,
  render(request) {
    return renderToReadableStream(
      <UltraServer request={request} importMap={importMap}>
        <TRPCServerProvider>
          <StaticRouter location={new URL(request.url).pathname}>
            <Shell />
          </StaticRouter>
        </TRPCServerProvider>
      </UltraServer>,
      {
        bootstrapModules: [
          import.meta.resolve("./client.tsx"),
        ],
      },
    );
  },
});

const compiler = createCompilerHandler({
  root,
});

const compilerPlaylist = createCompilerHandler({
  root,
}, "/playlist/");

const staticHandler = createStaticHandler({
  pathToRoot: import.meta.resolve("./public"),
});

const executeHandlers = composeHandlers(
  renderer,
  compiler,
  compilerPlaylist,
  {
    supportsRequest: (request) => {
      return request.url.includes("/ultra/");
    },
    handleRequest: async (request) => {
      const { pathname } = new URL(request.url);
      return new Response(
        (await Deno.open("../" + pathname)).readable,
        {
          headers: {
            "Content-Type": "application/javascript",
          },
        },
      );
    },
  },
  {
    supportsRequest: (request) => {
      const { pathname } = new URL(request.url);
      return pathname.startsWith("/api/trpc");
    },
    handleRequest: (request) =>
      fetchRequestHandler({
        endpoint: "/api/trpc",
        req: request,
        router: appRouter,
        createContext: () => ({}),
      }),
  },
  staticHandler,
);

const middleware = refresh();

serve((request) => {
  const refresh = middleware(request);
  if (refresh) return refresh;

  const response = executeHandlers(request);
  if (response) return response;

  return new Response("Not Found", { status: 404 });
});
