import {
  makePlaylistId,
  makePlaylistUrl,
  PlaylistId,
} from "@/packages/types/brands.ts";

export type ToTPlaylistMappingItemSpeed =
  | "Adep"
  | "Acc"
  | "Mid"
  | "Fas"
  | "Sonic"
  | "Other"
  | "Legacy";
export type ToTPlaylistMappingItemTech =
  | "Chill"
  | "Comfy"
  | "Tech"
  | "Hitech"
  | "Anglehell"
  | "Tempo"
  | "Other"
  | "Legacy";
export type ToTPlaylistMappingItem = {
  displayName: string;
  playlistId: PlaylistId;
  speedCategory: ToTPlaylistMappingItemSpeed;
  techCategory: ToTPlaylistMappingItemTech;
};

export const playlistMapping: Record<string, ToTPlaylistMappingItem> = {
  "ToT - AdepComfy": {
    displayName: "AdepComfy",
    playlistId: makePlaylistId("01HK8XCHRH8RDXEEP9F4211NVG"),
    speedCategory: "Adep",
    techCategory: "Comfy",
  },
  "ToT - AdepTech": {
    displayName: "AdepTech",
    playlistId: makePlaylistId("01HK8XCHRJMANCHBSA0CVA354H"),
    speedCategory: "Adep",
    techCategory: "Tech",
  },
  "ToT - AdepHitech": {
    displayName: "AdepHitech",
    playlistId: makePlaylistId("01HK8XCHRNPHBZSJMKFWBPKD32"),
    speedCategory: "Adep",
    techCategory: "Hitech",
  },
  "ToT - AdepAnglehell": {
    displayName: "AdepAnglehell",
    playlistId: makePlaylistId("01HM4203RYZX1QKGFSX53GTJ1A"),
    speedCategory: "Adep",
    techCategory: "Anglehell",
  },
  "ToT - AdepTempo": {
    displayName: "AdepTempo",
    playlistId: makePlaylistId("01HM4203S9ZDF4C4SR1CF25JPN"),
    speedCategory: "Adep",
    techCategory: "Tempo",
  },

  "ToT - AccComfy": {
    displayName: "AccComfy",
    playlistId: makePlaylistId("01HK8XCHR9VPKXQ898F7TPWVFM"),
    speedCategory: "Acc",
    techCategory: "Comfy",
  },
  "ToT - AccTech": {
    displayName: "AccTech",
    playlistId: makePlaylistId("01HK8XCHQ6KFWB4MRA796Q0245"),
    speedCategory: "Acc",
    techCategory: "Tech",
  },
  "ToT - AccHitech": {
    displayName: "AccHitech",
    playlistId: makePlaylistId("01HK8XCHRDHER45YMZ7XDS0RZ6"),
    speedCategory: "Acc",
    techCategory: "Hitech",
  },
  "ToT - AccAnglehell": {
    displayName: "AccAnglehell",
    playlistId: makePlaylistId("01HK8XCHQCFJCC8B6BJNY2F0A1"),
    speedCategory: "Acc",
    techCategory: "Anglehell",
  },
  "ToT - AccTempo": {
    displayName: "AccTempo",
    playlistId: makePlaylistId("01HK8XCHRRG9MJ0QM2FT5ZP6SP"),
    speedCategory: "Acc",
    techCategory: "Tempo",
  },

  "ToT - MidComfy": {
    displayName: "MidComfy",
    playlistId: makePlaylistId("01HM4203SPHDAP94MS02S49JC6"),
    speedCategory: "Mid",
    techCategory: "Comfy",
  },
  "ToT - MidTech": {
    displayName: "MidTech",
    playlistId: makePlaylistId("01HK8XCHRK0NSY3PNTPPBJ0X1F"),
    speedCategory: "Mid",
    techCategory: "Tech",
  },
  "ToT - MidHitech": {
    displayName: "MidHitech",
    playlistId: makePlaylistId("01HK8XCHPPDM9XD77EGJCVTA81"),
    speedCategory: "Mid",
    techCategory: "Hitech",
  },
  "ToT - MidAnglehell": {
    displayName: "MidAnglehell",
    playlistId: makePlaylistId("01HM4203SHXNGDMWZVY685MDVR"),
    speedCategory: "Mid",
    techCategory: "Anglehell",
  },
  "ToT - MidTempo": {
    displayName: "MidTempo",
    playlistId: makePlaylistId("01HM7KRRZ7H0XFCNX8D9WY5ATP"),
    speedCategory: "Mid",
    techCategory: "Tempo",
  },

  "ToT - FasComfy": {
    displayName: "FasComfy",
    playlistId: makePlaylistId("01HM4203RT18K3SZ4VEJ79E12G"),
    speedCategory: "Fas",
    techCategory: "Comfy",
  },
  "ToT - FasTech": {
    displayName: "FasTech",
    playlistId: makePlaylistId("01HM4203RR9TZ2KAYG3BQ4ZJRV"),
    speedCategory: "Fas",
    techCategory: "Tech",
  },
  "ToT - FasHitech": {
    displayName: "FasHitech",
    playlistId: makePlaylistId("01HM4203S214YAVEJ6NWWE3KF0"),
    speedCategory: "Fas",
    techCategory: "Hitech",
  },
  "ToT - FasAnglehell": {
    displayName: "FasAnglehell",
    playlistId: makePlaylistId("01HM4203SQNWEVXQ5KPVXY8QHJ"),
    speedCategory: "Fas",
    techCategory: "Anglehell",
  },

  "ToT - SonicComfy": {
    displayName: "SonicComfy",
    playlistId: makePlaylistId("01HM7KRS01RR2YY4PSBN4F7VE5"),
    speedCategory: "Sonic",
    techCategory: "Comfy",
  },
  "ToT - SonicTech": {
    displayName: "SonicTech",
    playlistId: makePlaylistId("01HM4203SGVE0M1ZBPQ89F42K7"),
    speedCategory: "Sonic",
    techCategory: "Tech",
  },
  "ToT - SonicHitech": {
    displayName: "SonicHitech",
    playlistId: makePlaylistId("01HM7KRRZGV8Q5F7FXDK9FDGYG"),
    speedCategory: "Sonic",
    techCategory: "Hitech",
  },
  // "ToT - RainbowSurf": {
  //   displayName: "RainbowSurf",
  //   speedCategory: "Other",
  //   techCategory: "Other"
  // },
  // "ToT - StaminaTech": {
  //   displayName: "StaminaTech",
  //   speedCategory: "Other",
  //   techCategory: "Other"
  // },
  // "ToT - *": {
  //   displayName: "All from ToT",
  //   speedCategory: "Other",
  //   techCategory: "Other"
  // },
  // "ToT - OldHard": {
  //   displayName: "Legacy - Hard",
  //   speedCategory: "Legacy",
  //   techCategory: "Legacy"
  // },
  // "ToT - OldSuperHard": {
  //   displayName: "Legacy - SuperHard",
  //   speedCategory: "Legacy",
  //   techCategory: "Legacy"
  // },
  // "ToT - OldPractice": {
  //   displayName: "Legacy - OldPractice",
  //   speedCategory: "Legacy",
  //   techCategory: "Legacy"
  // },
  // "ToT - OldVeryHard": {
  //   displayName: "Legacy - VeryHard",
  //   speedCategory: "Legacy",
  //   techCategory: "Legacy"
  // },
  // "ToT - OldTek": {
  //   displayName: "Legacy - Tek",
  //   speedCategory: "Legacy",
  //   techCategory: "Legacy"
  // },
  // "ToT - OldInteresting": {
  //   displayName: "Legacy - Interesting",
  //   speedCategory: "Legacy",
  //   techCategory: "Legacy"
  // },
  // "ToT - OldFitbeat": {
  //   displayName: "Legacy - Fitbeat",
  //   speedCategory: "Legacy",
  //   techCategory: "Legacy"
  // },
};
export const getPlaylistUrlFromPlaylistId = (
  playlistId: PlaylistId,
) => makePlaylistUrl(`/api/v1/playlist/get/${playlistId}`);

export const getToTPlaylistSpeedCategory = (
  speedCategory: ToTPlaylistMappingItemSpeed,
) => {
  switch (speedCategory) {
    case "Adep":
      return "Slower";
    case "Acc":
      return "Average";
    case "Mid":
      return "Faster";
    case "Fas":
      return "Very fast";
    case "Sonic":
      return "Insane";
  }
};

export const getToTPlaylistTechCategory = (
  speedCategory: ToTPlaylistMappingItemTech,
) => {
  switch (speedCategory) {
    case "Comfy":
      return "Easy";
    case "Tech":
      return "Normal";
    case "Hitech":
      return "Hard";
    case "Anglehell":
      return "Expert";
    case "Tempo":
      return "Insane";
  }
};
