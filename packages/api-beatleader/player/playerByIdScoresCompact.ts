import { z } from "zod";
import { resource } from "zod-api";
import { paginatedResponseSchemaWrapper } from "@/packages/api-beatleader/common.ts";

export namespace BeatLeaderAPIPlayerByIdScoresCompact {
  export namespace GET {
    const ItemLeaderboard = z.object({
      id: z.string(),
      songHash: z.string(),
      modeName: z.string(),
      difficulty: z.number(),
    });
    export type ItemLeaderboardT = typeof ItemLeaderboard._type;

    const ItemScore = z.object({
      id: z.number(),
      originalId: z.number(),
      baseScore: z.number(),
      modifiedScore: z.number(),
      modifiers: z.string(),
      fullCombo: z.boolean(),
      maxCombo: z.number(),
      missedNotes: z.number(),
      badCuts: z.number(),
      hmd: z.number(),
      controller: z.number(),
      accuracy: z.number(),
      pp: z.number(),
      epochTime: z.number(),
    });
    export type ItemScoreT = typeof ItemScore._type;

    const Item = z.object({
      score: ItemScore,
      leaderboard: ItemLeaderboard,
    });
    export type ItemT = typeof Item._type;

    export const SuccessSchema = paginatedResponseSchemaWrapper(z.array(Item));
    export type SuccessSchemaT = typeof SuccessSchema._type;
  }

  const urlParamsSchema = z.object({
    playerId: z.string(),
  });

  export const Resource = resource("/player/:playerId/scores/compact", {
    urlParamsSchema,
    actions: {
      get: {
        dataSchema: GET.SuccessSchema,
      },
      post: {
        dataSchema: GET.SuccessSchema,
        bodySchema: z.array(z.object({
          songs: z.array(z.object({ id: z.string(), hash: z.string(), levelid: z.string() }))
        }))
      },
    },
  });
}
