import { z } from "zod";
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
