import { z } from "https://deno.land/x/zod@v3.21.4/mod.ts";

export const BeatSaberDifficultyCharacteristicSchema = z.enum([
  "Standard",
  "Lawless",
  "OneSaber",
  "Lightshow",
  "NoArrows",
  "360Degree"
])

export const BeatSaberDifficultyNameSchema = z.enum([
  "ExpertPlus",
  "Expert",
  "Hard",
  "Normal",
  "Easy"
]);
