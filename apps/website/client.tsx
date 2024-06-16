import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import UltraClient, { hydrate } from "ultra/lib/react/client.js";
import { TRPCClientProvider } from "@/packages/trpc/ClientProvider.tsx";
import { queryClient } from "@/packages/react-query/query-client.ts";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import App from "@/apps/website/App.tsx";

declare const __REACT_QUERY_DEHYDRATED_STATE: unknown;

function ClientApp() {
  return (
    <UltraClient>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>
            <TRPCClientProvider internal>
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
  hydrate(document, <ClientApp />);
} catch (err) {
  console.error("There was an error while hydrating", err);
}
