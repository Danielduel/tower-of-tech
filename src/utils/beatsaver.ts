import type { BeatSaverMapResponse } from "../types/BeatSaver.d.ts";

export const getMapDataByKey = async (key: string): Promise<BeatSaverMapResponse> => {
  const response = await fetch(`https://beatsaver.com/api/maps/id/${key}`);
  return (await response.json()) as BeatSaverMapResponse;
};

export const getMapDataByHash = async (hash: string): Promise<BeatSaverMapResponse> => {
  const response = await fetch(`https://beatsaver.com/api/maps/hash/${hash}`);
  return (await response.json()) as BeatSaverMapResponse;
};
