import { z } from "zod";
import { makeLowercaseMapHash } from "@/packages/types/brands.ts";

const scoreImprovement = z.object({
  accLeft: z.number(),
  accRight: z.number(),
  accuracy: z.number(),
  averageRankedAccuracy: z.number(),
  badCuts: z.number(),
  bombCuts: z.number(),
  bonusPp: z.number(),
  id: z.number(), // todo narrow
  missedNotes: z.number(),
  pauses: z.number(),
  pp: z.number(),
  rank: z.number(),
  score: z.number(),
  timeset: z.string(), // ????
  totalPp: z.number(),
  totalRank: z.number(),
  wallsHit: z.number(),
});

const contextExtension = z.object({
  accPP: z.number(), // convention?
  accuracy: z.number(),
  baseScore: z.number(),
  bonusPp: z.number(),
  context: z.number(), // todo narrow
  id: z.number(), // todo narrow
  modifiedScore: z.number(),
  modifiers: z.string(), // todo narrow
  passPP: z.number(), // convention?
  playerId: z.string(), // todo narrow
  pp: z.number(),
  rank: z.number(),

  scoreImprovement: scoreImprovement.nullable(),

  techPP: z.number(), // convention?
  weight: z.number(),
});

const modifierValues = z.object({
  da: z.number(),
  fs: z.number(),
  gn: z.number(),
  modifierId: z.number(),
  na: z.number(),
  nb: z.number(),
  nf: z.number(),
  no: z.number(),
  op: z.number(),
  pm: z.number(),
  sa: z.number(),
  sc: z.number(),
  sf: z.number(),
  ss: z.number(),
});

const modifiersRating = z.object({
  fsAccRating: z.number(),
  fsPassRating: z.number(),
  fsPredictedAcc: z.number(),
  fsStars: z.number(),
  fsTechRating: z.number(),
  id: z.number(), // todo narrow
  sfAccRating: z.number(),
  sfPassRating: z.number(),
  sfStars: z.number(),
  sfTechRating: z.number(),
  ssAccRating: z.number(),
  ssPassRating: z.number(),
  ssPredictedAcc: z.number(),
  ssStars: z.number(),
  ssTechRating: z.number(),
});

const difficulty = z.object({
  accRating: z.number().nullable(),
  bombs: z.number(),
  difficultyName: z.string(), // todo narrow
  duration: z.number(),
  featureTags: z.number(), // todo narrow
  id: z.number(),
  maxScore: z.number(),
  mode: z.number(), // todo narrow
  modeName: z.string(), // todo narrow

  modifierValues,
  modifiersRating: modifiersRating.nullable(),

  njs: z.number(),
  nominatedTime: z.number(),
  notes: z.number(),
  nps: z.number(),
  passRating: z.number().nullable(),
  predictedAcc: z.number().nullable(),
  qualifiedTime: z.number(),
  rankedTime: z.number(),
  requirements: z.number(), // todo narrow
  speedTags: z.number(),
  techRating: z.number().nullable(),
  type: z.number(), // ???
  value: z.number(), // ???
  walls: z.number(),
});

const song = z.object({
  author: z.string(),
  bpm: z.number(),
  collaboratorIds: z.any(), // ???
  coverImage: z.string(), // todo narrow
  duration: z.number(),
  fullCoverImage: z.any(), // ???
  hash: z.string().transform(makeLowercaseMapHash),
  id: z.string(), // todo narrow (beatsaver id)
  mapper: z.string(),
  mapperId: z.number(), // todo narrow
  name: z.string(),
  subName: z.string(),
});

const leaderboard = z.object({
  difficulty,

  id: z.string(), // todo narrow

  song,
});

const offsets = z.object({
  frames: z.number(),
  heights: z.number(),
  notes: z.number(),
  pauses: z.number(),
  walls: z.number(),
});

const player = z.object({
  alias: z.any(), // ???
  avatar: z.string(), // todo narrow
  bot: z.boolean(),
  clanOrder: z.string(), // todo narrow
  clans: z.array(z.any()).nullable(), // todo narrow
  contextExtensions: z.any(), // todo narrow
  country: z.string(), // todo narrow
  countryRank: z.number(),
  id: z.string(), // todo narrow
  name: z.string(),
  patreonFeatures: z.any(), // todo narrow
  platform: z.string(), // todo narrow
  pp: z.number(),
  profileSettings: z.any(), // todo narrow
  rank: z.number(),
  role: z.string(), // todo narrow
  socials: z.any(), // todo narrow
});

const acceptedDataInner = z.object({
  accLeft: z.number(),
  accPP: z.number(),
  accRight: z.number(),
  accuracy: z.number(),
  badCuts: z.number(),
  baseScore: z.number(),
  bombCuts: z.number(),
  bonusPp: z.number(),

  contextExtensions: z.array(contextExtension),

  controller: z.number(),
  country: z.string(), // todo narrow
  fcAccuracy: z.number(),
  fcPp: z.number(),
  fullCombo: z.boolean(),
  hmd: z.number(), // todo narrow
  id: z.number(), // todo narrow
  lastTryTime: z.number(),

  leaderboard: leaderboard.nullable(), // todo remove nullable
  leaderboardId: z.string(), // todo narrow

  maxCombo: z.number(),
  maxStreak: z.number().nullable(),
  metadata: z.any(), // ???
  missedNotes: z.number(),
  modifiedScore: z.number(),
  modifiers: z.string(), // todo narrow
  myScore: z.any(), // todo narrow

  offsets: offsets.nullable(), // ???

  passPP: z.number(),
  pauses: z.number(),
  platform: z.string(), // todo narrow
  playCount: z.number(),

  player,
  playerId: z.string(), // todo narrow

  pp: z.number(),
  priority: z.number(), // ???
  rank: z.number(),
  rankVoting: z.any(), // ???
  replay: z.string(), // todo narrow
  replaysWatched: z.number(),
  scoreImprovement: scoreImprovement.nullable(),

  techPP: z.number(),
  timepost: z.number(),
  timeset: z.string(),

  validContexts: z.number(), // todo narrow
  wallsHit: z.number(),
  weight: z.number(),
});

export const BeatLeaderGeneralSocketAccepted = z.object({
  message: z.enum(["accepted"]), // todo narrow to "accepted"
  data: acceptedDataInner,
});

export const BeatLeaderGeneralSocketAny = z.object({
  message: z.enum(["accepted", "upload"]),
  data: z.any(),
});
