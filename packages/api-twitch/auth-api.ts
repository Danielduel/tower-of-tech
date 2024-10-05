import { z } from "zod";
import { client, resource } from "zod-api";
import { fetcher } from "@/packages/api-utils/fetcher.ts";
import { getLogger } from "@/packages/api-utils/logger.ts";
import { appAccessTokenSchema } from "@/packages/api-twitch/helix-schema/brand.ts";

export const defaultHeaders = {
  "Content-Type": "application/x-www-form-urlencoded",
};

export const TwitchAuthApi = client({
  fetcher,
  baseUrl: "https://id.twitch.tv",
  logger: await getLogger(),
  resources: {
    token: resource("/oauth2/token", {
      actions: {
        post: {
          dataSchema: z.object({
            access_token: appAccessTokenSchema,
            expires_in: z.number(),
            token_type: z.string(),
          }),
          headersSchema: z.object({}),
          bodySchema: z.object({ __STRIP_URL_STRING__: z.string() }) as unknown as (ReturnType<typeof z.object>),
        },
      },
    }),
  },
});
