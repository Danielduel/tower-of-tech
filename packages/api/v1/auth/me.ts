import { HandlerForRoute } from "@/packages/api/v1/types.ts";
import { getAccountFromRequestM } from "@/packages/api/v1/auth/common.ts";

export const apiV1HandlerAuthMeRoute = "/api/v1/auth/me";

export const apiV1HandlerAuthMe: HandlerForRoute<
  typeof apiV1HandlerAuthMeRoute
> = async (request: Request) => {
  const account = await getAccountFromRequestM(request);
  return new Response(JSON.stringify({ account }, undefined, 2));
};
