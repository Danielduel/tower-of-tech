import { type ReactNode } from "react";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/packages/react-query/query-client.ts";
import { trpc } from "./trpc.ts";

declare const __REACT_QUERY_DEHYDRATED_STATE: unknown;

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      maxURLLength: 1000 * 50
    }),
  ],
});

export function TRPCClientProvider({ children }: { children?: ReactNode }) {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>{children}</Hydrate>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
