import { renderToReadableStream } from "react-dom/server";
import { createCompilerHandler } from "ultra/lib/react/compiler.ts";
import { createRenderHandler } from "ultra/lib/react/renderer.ts";
import UltraServer from "ultra/lib/react/server.js";
import { readImportMap } from "ultra/lib/utils/import-map.ts";
import { createStaticHandler } from "ultra/lib/static/handler.ts";
import { composeHandlers } from "ultra/lib/handler.ts";
import { refresh } from "https://deno.land/x/refresh@1.0.0/mod.ts";
import { compile } from "mesozoic/lib/compiler.ts";
import { StaticRouter } from "react-router-dom/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/packages/trpc/router.ts";
import { TRPCServerProvider } from "@/packages/trpc/server.tsx";

import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/packages/react-query/query-client.ts";
import { StrictMode } from "react";
import { apiV1Handler } from "@/packages/api/v1/mod.ts";
import { isLocal } from "@/packages/utils/envrionment.ts";
import { runWorker } from "@/packages/api-beatsaver/cache.ts";
import { registerDiscordCronJobs } from "@/packages/discord/cron/mod.ts";

const root = Deno.cwd();

const importMap = Deno.env.get("ULTRA_MODE") === "development"
  ? await readImportMap("./importMap.local.json")
  : await readImportMap("./importMap.json");

importMap.imports["ultra/"] = "/_ultra/";
importMap.imports["@/"] = "/@/";
importMap.imports["zod"] = "/_x/zod@v3.22.4/mod.ts";
importMap.imports["kvdex/"] = "/_x/kvdex@v0.31.0/";
importMap.imports["https://deno.land/x/"] = "/_x/";

const renderer = createRenderHandler({
  root,
  render(request) {
    return renderToReadableStream(
      <UltraServer request={request} importMap={importMap}>
        <StrictMode>
          <HelmetProvider>
            <QueryClientProvider client={queryClient}>
              <TRPCServerProvider>
                <StaticRouter location={new URL(request.url).pathname}>
                  <App />
                </StaticRouter>
              </TRPCServerProvider>
            </QueryClientProvider>
          </HelmetProvider>
        </StrictMode>
      </UltraServer>,
      {
        bootstrapModules: [
          "@/apps/editor/client.tsx",
        ],
      },
    );
  },
});

const compiler = createCompilerHandler({
  root: "https://deno.land/x/danielduel_ultra_stack_ultra@0.0.13",
});

const staticHandler = createStaticHandler({
  pathToRoot: import.meta.resolve("./public"),
});

const executeHandlers = composeHandlers(
  {
    supportsRequest: (request) => {
      return request.url.includes("/api/v1/");
    },
    handleRequest: async (request) => {
      return await apiV1Handler(request);
    },
  },
  {
    supportsRequest: (request) => {
      return request.url.includes("/@/");
    },
    handleRequest: async (request) => {
      const { pathname } = new URL(request.url);
      const realPathName = pathname.split("/@")[1];

      const fileUrl = root + realPathName;
      const source = await Deno.readTextFile(fileUrl);
      const result = await compile(fileUrl.toString(), source, {
        jsxImportSource: "react",
        development: true,
        minify: false,
      });

      return new Response(
        result,
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
      return request.url.includes("///");
    },
    handleRequest: async (request) => {
      const { pathname } = new URL(request.url);
      const realPathName = "/" + pathname.split("///")[1];
      console.log(realPathName);

      const fileUrl = root + realPathName;
      const source = await Deno.readTextFile(fileUrl);
      const result = await compile(fileUrl.toString(), source, {
        jsxImportSource: "react",
        development: true,
        minify: false,
      });

      return new Response(
        result,
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
      return request.url.includes("/_x/");
    },
    handleRequest: async (request) => {
      const { pathname } = new URL(request.url);
      const realPathName = pathname.split("/_x/")[1];
      const fullPathName = `https://deno.land/x/${realPathName}`;
      const content = await fetch(fullPathName);
      const result = await compile(fullPathName, await content.text(), {
        jsxImportSource: "react",
        development: true,
        minify: false,
      });

      return new Response(
        result,
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
  renderer,
  compiler,
  staticHandler,
);

const middleware = refresh({
  paths: ["./apps", "./packages"],
});

runWorker();
registerDiscordCronJobs();

Deno.serve({ port: isLocal() ? 8081 : 80 }, async (request, ctx) => {
  const refresh = middleware(request);
  if (refresh) return refresh;

  const response = await executeHandlers(request);
  if (response) {
    response.headers.append("Access-Control-Allow-Origin", "*");
    return response;
  }

  return new Response("Not Found", { status: 404 });
});
