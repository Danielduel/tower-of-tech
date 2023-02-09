import type { BeatSaberDifficultyName, BeatSaberDifficultyCharacteristic } from "./BeatSaber.d.ts";

export type BeatSaverMapResponseUploader = {
  id: number;
  name: string;
  avatar: string;
  type: string;
  admin: boolean;
  curator: boolean;
  playlistUrl: string;
};

export type BeatSaverMapResponseMetadata = {
  bpm: number;
  duration: number;
  songName: string;
  songSubName: string;
  songAuthorName: string;
  levelAuthorName: string;
};

export type BeatSaverMapResponseStats = {
  plays: number;
  downloads: number;
  upvotes: number;
  downvotes: number;
  score: number; // 0-1
};

export type BeatSaverMapResponseVersionsItemState =
  "Published";

export type BeatSaverMapResponseVersionsItemDiffItemParitySummary = {
  error: number;
  warns: number;
  resets: number;
};

export type BeatSaverMapResponseVersionsItemDiffItem = {
  njs: number;
  offset: number;
  notes: number;
  bombs: number;
  obstacles: number;
  nps: number;
  length: number;
  characteristic: BeatSaberDifficultyCharacteristic;
  difficulty: BeatSaberDifficultyName;
  events: number;
  chroma: boolean;
  me: boolean;
  ne: boolean;
  cinema: boolean;
  seconds: number;
  paritySummary: BeatSaverMapResponseVersionsItemDiffItemParitySummary;
  maxScore: number;
  label: string;
};

export type BeatSaverMapResponseVersionsItem = {
  hash: string;
  state: BeatSaverMapResponseVersionsItemState;
  createdAt: string;
  sageScore: number;
  diffs: BeatSaverMapResponseVersionsItemDiffItem[];
  downloadURL: string;
  coverURL: string;
  previewURL: string;
}

export type BeatSaverMapResponseNotFound = {
  error: "Not Found";
};

export type BeatSaverMapResponseSuccess = {
  id: string;
  name: string;
  description: string;
  uploader: BeatSaverMapResponseUploader;
  metadata: BeatSaverMapResponseMetadata;
  stats: BeatSaverMapResponseStats;
  uploaded: string;
  automapper: boolean;
  ranked: boolean;
  qualified: boolean;
  versions: BeatSaverMapResponseVersionsItem[];
  createdAt: string;
  updatedAt: string;
  lastPublishedAt: string;
  tags: string[];
  bookmarked: boolean;
};

export type BeatSaverMapResponse = BeatSaverMapResponseSuccess | BeatSaverMapResponseNotFound;
