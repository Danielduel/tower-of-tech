import { z } from "zod";

export const BeatSaberDifficultyCharacteristicSchema = z.enum([
  "Standard",
  "Lawless",
  "Legacy",
  "OneSaber",
  "Lightshow",
  "NoArrows",
  "360Degree",
  "90Degree",
]);

export const BeatSaberDifficultyNameSchema = z.enum([
  "ExpertPlus",
  "Expert",
  "Hard",
  "Normal",
  "Easy",
]);
