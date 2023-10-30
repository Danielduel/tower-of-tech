// React Router
import { BrowserRouter } from "react-router-dom";

// React Query
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/react-query/query-client.ts";
import { TRPCClientProvider } from "@/trpc/client.tsx";
import UltraClient, { hydrate } from "ultra/lib/react/client.js";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
declare const __REACT_QUERY_DEHYDRATED_STATE: unknown;

function ClientApp() {
  return (
    <UltraClient>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>
            <TRPCClientProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </TRPCClientProvider>
          </Hydrate>
        </QueryClientProvider>
      </HelmetProvider>
    </UltraClient>
  );
}

try {
  hydrate(document, <ClientApp />)
} catch (err) {
  console.error("There was an error while hydrating", err)
}