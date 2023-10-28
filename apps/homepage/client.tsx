// React Router
import { BrowserRouter } from "react-router-dom";

// React Query
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/react-query/query-client.ts";
import { TRPCClientProvider } from "@/trpc/client.tsx";
import ShellApp from "./shell-app.tsx";
import { hydrate } from "ultra/lib/react/client.js";
import { HelmetProvider } from "react-helmet-async";
declare const __REACT_QUERY_DEHYDRATED_STATE: unknown;

function ClientApp() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>
          <TRPCClientProvider>
            <BrowserRouter>
              <ShellApp />
            </BrowserRouter>
          </TRPCClientProvider>
        </Hydrate>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

hydrate(document.getElementById("root")!, <ClientApp />);
