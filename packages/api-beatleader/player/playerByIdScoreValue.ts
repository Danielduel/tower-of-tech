import { z } from "zod";
import { resource } from "zod-api";
import { BeatSaberDifficultyCharacteristicSchema, BeatSaberDifficultyNameSchema } from "@/packages/types/beatsaber.ts";

export namespace BeatLeaderAPIPlayerByIdScoreValue {
  export namespace GET {
    export const SuccessSchema = z.number();
    export type SuccessSchemaT = typeof SuccessSchema._type;
    export const BodySchema = z.object({});
  }

  const urlParamsSchema = z.object({
    playerId: z.string(),
    mapHash: z.string(),
    mapDifficulty: BeatSaberDifficultyNameSchema,
    mapMode: BeatSaberDifficultyCharacteristicSchema,
  });


  export const Resource = resource("/player/:playerId/scorevalue/:mapHash/:mapDifficulty/:mapMode", {
    urlParamsSchema,
    actions: {
      get: {
        dataSchema: GET.SuccessSchema,
        bodySchema: GET.BodySchema
      },
    },
  });
}

