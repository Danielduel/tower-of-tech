import { z } from "zod";
import {
  DiscordUserAccessToken,
  discordUserAccessTokenHeaderSchema,
  makeDiscordUserAccessTokenHeader,
} from "@/packages/api-discord/brand.ts";

export const discordUserAuthHeadersSchema = z.object({
  Authorization: discordUserAccessTokenHeaderSchema,
});
export type DiscordUserAuthHeadersSchemaT = typeof discordUserAuthHeadersSchema._type;

export const createDiscordUserAuthHeaders = (
  discordUserAccessToken: DiscordUserAccessToken,
): DiscordUserAuthHeadersSchemaT => ({
  Authorization: makeDiscordUserAccessTokenHeader(`Bearer ${discordUserAccessToken}`),
});
