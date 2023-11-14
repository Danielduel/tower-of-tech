import { Suspense } from "react";
import useAsset from "ultra/hooks/use-asset.js";
import { ErrorBoundary } from "https://esm.sh/*react-error-boundary@4.0.11";
import { ImportMapScript } from "ultra/lib/react/client.js";

import { dehydrate } from "@tanstack/react-query";
import { queryClient } from "@/packages/react-query/query-client.ts";
import { TwindStyleTag, tw } from "@/packages/twind/twind.tsx";
import Index from "./pages/index.tsx";

const logError = (error: Error, info: { componentStack: string }) => {
  console.log(error, info);
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Ultra</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="stylesheet" href={useAsset("/style.css")} />
        <ImportMapScript />
        <script
          dangerouslySetInnerHTML={{
            __html: `
            const Deno = {
              env: {
                get: (env) => {
                  switch(env) {
                    case "TOT_ENVIRONMENT": return "${Deno.env.get("TOT_ENVIRONMENT")}";
                    case "TOT_REMOTE": return "${Deno.env.get("TOT_REMOTE")}";
                  }
                }
              }
            };
            window.__REACT_QUERY_DEHYDRATED_STATE = ${JSON.stringify(dehydrate(queryClient))};
          `
          }}
        ></script>
      </head>
      <body>
        <ErrorBoundary
          fallback={<div>Something went wrong</div>}
          onError={logError}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Index />
          </Suspense>
        </ErrorBoundary>
        <TwindStyleTag />
      </body>
    </html>
  );
};
