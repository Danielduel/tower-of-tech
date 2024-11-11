import { z } from "zod";
import { client, resource } from "zod-api";
import { fetcher } from "@/packages/api-utils/fetcher.ts";
import { getLogger } from "@/packages/api-utils/logger.ts";
import { beatLeaderUserAuthHeadersSchema } from "@/packages/api-beatleader/common.ts";
import { beatLeaderUserIdSchema } from "@/packages/api-beatleader/brand.ts";

const beatLeaderApiOauthIdentityBodySchema = z.object({
  id: beatLeaderUserIdSchema,
  name: z.string(),
});
export type BeatLeaderApiOauthIdentityBodySchemaT = typeof beatLeaderApiOauthIdentityBodySchema._type;

export const BeatLeaderApi = client({
  fetcher,
  baseUrl: "https://api.beatleader.xyz",
  logger: await getLogger(),
  resources: {
    oauthIdentity: resource("/oauth2/identity", {
      actions: {
        get: {
          headersSchema: beatLeaderUserAuthHeadersSchema,
          dataSchema: beatLeaderApiOauthIdentityBodySchema,
        },
      },
    }),
  },
});
