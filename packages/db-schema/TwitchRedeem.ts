import { z } from "zod";
import {
  broadcasterIdSchema,
  twitchChannelPointsCustomRewardIdSchema,
  twitchRedeemMappingKeyIdSchema,
} from "@/packages/api-twitch/helix/brand.ts";
import { collection } from "@/packages/deps/kvdex.ts";
import { getTwitchRedeemMappingKey } from "./keys.ts";

export const TwitchRedeemMappingSchema = z.object({
  id: twitchRedeemMappingKeyIdSchema,
  twitchRedeemId: twitchChannelPointsCustomRewardIdSchema,
  channelId: broadcasterIdSchema,
  name: z.string(),
});
export type TwitchRedeemMappingSchemaT = typeof TwitchRedeemMappingSchema._type;

export const TwitchRedeemMapping = collection(
  TwitchRedeemMappingSchema,
  {
    indices: {
      id: "primary",
      twitchRedeemId: "secondary",
    },
    idGenerator: (item) => getTwitchRedeemMappingKey(item.channelId, item.name),
    history: true,
  },
);
