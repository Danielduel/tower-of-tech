import { type ReactNode } from "react";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/packages/react-query/query-client.ts";
import { trpc } from "./trpc.ts";

declare const __REACT_QUERY_DEHYDRATED_STATE: unknown;

const getTrpcClient = (url: string) =>
  trpc.createClient({
    links: [
      httpBatchLink({
        url,
        maxURLLength: 1000 * 50,
      }),
    ],
  });

export function TRPCClientProvider(
  { children, internal }: { children?: ReactNode; internal: boolean },
) {
  const trpcClient = internal
    ? getTrpcClient("/api/trpc")
    : getTrpcClient("https://tower-of-tech-editor.deno.dev/api/trpc");
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={__REACT_QUERY_DEHYDRATED_STATE}>{children}</Hydrate>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
