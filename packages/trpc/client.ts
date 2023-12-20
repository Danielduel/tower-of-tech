import { httpBatchLink } from "@trpc/client";
import { trpc } from "./trpc-react.ts";
import { isLocal } from "@/packages/utils/envrionment.ts";

const getTrpcClientFromUrl = (url: string) =>
  trpc.createClient({
    links: [
      httpBatchLink({
        url,
        maxURLLength: 1000 * 50
      }),
    ],
  });

export const createTrpcClient = (internal: boolean) => internal
  ? getTrpcClientFromUrl("/api/trpc")
  : isLocal()
    ? getTrpcClientFromUrl("http://localhost:8081/api/trpc")
    : getTrpcClientFromUrl("https://tower-of-tech-editor.deno.dev/api/trpc");
