import { z } from "zod";
import { client, resource } from "zod-api";
import { fetcher } from "@/packages/api-utils/fetcher.ts";
import { getLogger } from "@/packages/api-utils/logger.ts";
import { beatLeaderUserAuthHeadersSchema } from "@/packages/api-beatleader/common.ts";
import { beatLeaderUserIdSchema } from "@/packages/api-beatleader/brand.ts";
import { BeatLeaderAPIPlayerByIdScoresCompact } from "@/packages/api-beatleader/player/playerByIdScoresCompact.ts";
import { BeatLeaderAPIPlayerByIdScoreValue } from "@/packages/api-beatleader/player/playerByIdScoreValue.ts";

const beatLeaderApiOauthIdentityBodySchema = z.object({
  id: beatLeaderUserIdSchema,
  name: z.string(),
});
export type BeatLeaderApiOauthIdentityBodySchemaT = typeof beatLeaderApiOauthIdentityBodySchema._type;
export const BEATLEADER_API_URL = Deno.env.get("BEATLEADER_API_URL") || "https://api.beatleader.xyz";
export const BEATLEADER_SOCKETS_URL = Deno.env.get("BEATLEADER_SOCKETS_URL") || "wss://socket.beatleader.xyz";

export const BeatLeaderApi = client({
  fetcher,
  baseUrl: BEATLEADER_API_URL,
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
    playerByIdScoresCompact: BeatLeaderAPIPlayerByIdScoresCompact.Resource,
    playerByIdScoreValue: BeatLeaderAPIPlayerByIdScoreValue.Resource,
  },
});
