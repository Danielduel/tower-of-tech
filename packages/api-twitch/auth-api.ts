import { z } from "zod";
import { client, resource } from "zod-api";
import { fetcher } from "@/packages/api-utils/fetcher.ts";
import { getLogger } from "@/packages/api-utils/logger.ts";
import { appTokenSuccessSchema } from "@/packages/api-twitch/helix/common.ts";

export const defaultHeaders = {
  "Content-Type": "application/x-www-form-urlencoded",
};

export const TwitchBotAuthApi = client({
  fetcher,
  baseUrl: "https://id.twitch.tv",
  logger: await getLogger(),
  resources: {
    token: resource("/oauth2/token", {
      actions: {
        post: {
          dataSchema: appTokenSuccessSchema,
          headersSchema: z.object({}),
          bodySchema: z.object({ __STRIP_URL_STRING__: z.string() }) as unknown as (ReturnType<typeof z.object>),
        },
      },
    }),
  },
});

export const TwitchUserAuthApi = client({
  fetcher,
  baseUrl: "https://id.twitch.tv",
  logger: await getLogger(),
  resources: {
    token: resource("/oauth2/token", {
      actions: {
        post: {
          dataSchema: appTokenSuccessSchema,
          headersSchema: z.object({}),
          bodySchema: z.object({ __STRIP_URL_STRING__: z.string() }) as unknown as (ReturnType<typeof z.object>),
        },
      },
    }),
  },
});
