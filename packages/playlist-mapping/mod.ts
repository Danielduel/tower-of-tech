export const playlistMapping: Record<string, {
  displayName: string,
  apiDownloadPath: string,
  speedCategory: "Adep" | "Acc" | "Mid" | "Fas" | "Other" | "Legacy",
  techCategory: "Chill" | "Comfy" | "Tech" | "Hitech" | "Anglehell" | "Tempo" | "Other" | "Legacy"
}> = {
  "ToT - AdepComfy": {
    displayName: "AdepComfy",
    speedCategory: "Adep",
    techCategory: "Comfy"
  },
  "ToT - AdepTech": {
    displayName: "AdepTech",
    speedCategory: "Adep",
    techCategory: "Tech"
  },
  "ToT - AdepHitech": {
    displayName: "AdepHitech",
    speedCategory: "Adep",
    techCategory: "Hitech"
  },
  "ToT - AdepAnglehell": {
    displayName: "AdepHitech",
    speedCategory: "Adep",
    techCategory: "Anglehell"
  },
  "ToT - AdepTempo": {
    displayName: "AdepHitech",
    speedCategory: "Adep",
    techCategory: "Tempo"
  },

  "ToT - MidHitech": {
    displayName: "MidHiTech",
    speedCategory: "Mid",
    techCategory: "HiTech"
  },
  "ToT - RainbowSurf": {
    displayName: "RainbowSurf",
    speedCategory: "Other",
    techCategory: "Other"
  },
  "ToT - StaminaTech": {
    displayName: "StaminaTech",
    speedCategory: "Other",
    techCategory: "Other"
  },
  "ToT - AccTech": {
    displayName: "AccTech",
    speedCategory: "Acc",
    techCategory: "Tech"
  },
  "ToT - AccAnglehell": {
    displayName: "AccAnglehell",
    speedCategory: "Acc",
    techCategory: "Anglehell"
  },
  "ToT - AccChill": {
    displayName: "AccChill",
    speedCategory: "Acc",
    techCategory: "Chill"
  },
  "ToT - FasTech": {
    displayName: "FasTech",
    speedCategory: "Fas",
    techCategory: "Tech"
  },
  "ToT - AccComfy": {
    displayName: "AccComfy",
    speedCategory: "Acc",
    techCategory: "Comfy"
  },
  "ToT - AccHitech": {
    displayName: "AccHitech",
    speedCategory: "Acc",
    techCategory: "HiTech"
  },
  "ToT - FasHitech": {
    displayName: "FasHitech",
    speedCategory: "Fas",
    techCategory: "HiTech"
  },
  "ToT - MidTech": {
    displayName: "MidTech",
    speedCategory: "Mid",
    techCategory: "Tech"
  },
  "ToT - *": {
    displayName: "All from ToT",
    speedCategory: "Other",
    techCategory: "Other"
  },
  "ToT - MidAnglehell": {
    displayName: "MidAnglehell",
    speedCategory: "Mid",
    techCategory: "Anglehell"
  },
  "ToT - MidComfy": {
    displayName: "MidComfy",
    speedCategory: "Mid",
    techCategory: "Comfy"
  },
  "ToT - OldHard": {
    displayName: "Legacy - Hard",
    speedCategory: "Legacy",
    techCategory: "Legacy"
  },
  "ToT - OldSuperHard": {
    displayName: "Legacy - SuperHard",
    speedCategory: "Legacy",
    techCategory: "Legacy"
  },
  "ToT - OldPractice": {
    displayName: "Legacy - OldPractice",
    speedCategory: "Legacy",
    techCategory: "Legacy"
  },
  "ToT - OldVeryHard": {
    displayName: "Legacy - VeryHard",
    speedCategory: "Legacy",
    techCategory: "Legacy"
  },
  "ToT - OldTek": {
    displayName: "Legacy - Tek",
    speedCategory: "Legacy",
    techCategory: "Legacy"
  },
  "ToT - OldInteresting": {
    displayName: "Legacy - Interesting",
    speedCategory: "Legacy",
    techCategory: "Legacy"
  },
  "ToT - OldFitbeat": {
    displayName: "Legacy - Fitbeat",
    speedCategory: "Legacy",
    techCategory: "Legacy"
  },
}