import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { isLocal } from "@/packages/utils/envrionment.ts";
import type { AppRouter } from "@/packages/trpc/router.ts";

const getUrl = (internal: boolean) =>
  internal
    ? "/api/trpc"
    : isLocal()
    ? "http://localhost:8081/api/trpc"
    : "https://towerofte.ch/api/trpc";

export const createClient = (internal: boolean) =>
  createTRPCProxyClient<AppRouter>({
    links: [
      httpBatchLink({
        url: getUrl(internal),
        // You can pass any HTTP headers you wish here
        // async headers() {
        //   return {
        //     authorization: getAuthCookie(),
        //   };
        // },
      }),
    ],
  });
