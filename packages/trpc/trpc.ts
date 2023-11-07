import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "./router.ts";

export const trpc = createTRPCReact<AppRouter>();
