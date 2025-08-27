import { z, ZodTypeAny } from "zod";
import {
  BeatLeaderUserAccessToken,
  beatLeaderUserAccessTokenHeaderSchema,
  makeBeatLeaderUserAccessTokenHeader,
} from "@/packages/api-beatleader/brand.ts";

export const beatLeaderUserAuthHeadersSchema = z.object({
  Authorization: beatLeaderUserAccessTokenHeaderSchema,
});
export type BeatLeaderUserAuthHeadersSchemaT = typeof beatLeaderUserAuthHeadersSchema._type;

export const createBeatLeaderUserAuthHeaders = (
  beatLeaderUserAccessToken: BeatLeaderUserAccessToken,
): BeatLeaderUserAuthHeadersSchemaT => ({
  Authorization: makeBeatLeaderUserAccessTokenHeader(`Bearer ${beatLeaderUserAccessToken}`),
});

export const paginatedResponseSchemaWrapper = <T extends ZodTypeAny>(dataSchema: T) =>
  z.object({
    metadata: z.object({
      itemsPerPage: z.number(),
      page: z.number(),
      total: z.number(),
    }),
    data: dataSchema,
  });

