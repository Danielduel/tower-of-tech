import { type ReactNode } from "react";
import { trpc } from "./trpc-react.ts";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/packages/react-query/query-client.ts";
import { createTrpcClient } from "./client.ts";

const __REACT_QUERY_DEHYDRATED_STATE: unknown = {};

export function TRPCClientProvider(
  { children, internal }: { children?: ReactNode; internal: boolean },
) {
  const trpcClient = createTrpcClient(internal);
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={__REACT_QUERY_DEHYDRATED_STATE ?? {}}>{children}</Hydrate>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
1