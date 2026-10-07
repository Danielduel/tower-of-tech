import { makePlaylistId, PlaylistId } from "@/packages/types/brands.ts";

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
  path: string;
  pathMd: string;
  fileName: string;
  speedCategory: ToTPlaylistMappingItemSpeed;
  techCategory: ToTPlaylistMappingItemTech;
};

export const playlistMapping: Record<string, ToTPlaylistMappingItem> = {
  "ToT - AdepComfy": {
    displayName: "AdepComfy",
    playlistId: makePlaylistId("01HK8XCHRH8RDXEEP9F4211NVG"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5545 - ToT - AdepComfy.bplist",
    speedCategory: "Adep",
    techCategory: "Comfy",
  },
  "ToT - AdepTech": {
    displayName: "AdepTech",
    playlistId: makePlaylistId("01HK8XCHRJMANCHBSA0CVA354H"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5555 - ToT - AdepTech.bplist",
    speedCategory: "Adep",
    techCategory: "Tech",
  },
  "ToT - AdepHitech": {
    displayName: "AdepHitech",
    playlistId: makePlaylistId("01HK8XCHRNPHBZSJMKFWBPKD32"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5556 - ToT - AdepHitech.bplist",
    speedCategory: "Adep",
    techCategory: "Hitech",
  },
  "ToT - AdepAnglehell": {
    displayName: "AdepAnglehell",
    playlistId: makePlaylistId("01HM4203RYZX1QKGFSX53GTJ1A"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5565 - ToT - AdepAnglehell.bplist",
    speedCategory: "Adep",
    techCategory: "Anglehell",
  },
  "ToT - AdepTempo": {
    displayName: "AdepTempo",
    playlistId: makePlaylistId("01HM4203S9ZDF4C4SR1CF25JPN"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5566 - ToT - AdepTempo.bplist",
    speedCategory: "Adep",
    techCategory: "Tempo",
  },

  "ToT - AccComfy": {
    displayName: "AccComfy",
    playlistId: makePlaylistId("01HK8XCHR9VPKXQ898F7TPWVFM"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5655 - ToT - AccComfy.bplist",
    speedCategory: "Acc",
    techCategory: "Comfy",
  },
  "ToT - AccTech": {
    displayName: "AccTech",
    playlistId: makePlaylistId("01HK8XCHQ6KFWB4MRA796Q0245"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5665 - ToT - AccTech.bplist",
    speedCategory: "Acc",
    techCategory: "Tech",
  },
  "ToT - AccHitech": {
    displayName: "AccHitech",
    playlistId: makePlaylistId("01HK8XCHRDHER45YMZ7XDS0RZ6"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5666 - ToT - AccHitech.bplist",
    speedCategory: "Acc",
    techCategory: "Hitech",
  },
  "ToT - AccAnglehell": {
    displayName: "AccAnglehell",
    playlistId: makePlaylistId("01HK8XCHQCFJCC8B6BJNY2F0A1"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5667 - ToT - AccAnglehell.bplist",
    speedCategory: "Acc",
    techCategory: "Anglehell",
  },
  "ToT - AccTempo": {
    displayName: "AccTempo",
    playlistId: makePlaylistId("01HK8XCHRRG9MJ0QM2FT5ZP6SP"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5668 - ToT - AccTempo.bplist",
    speedCategory: "Acc",
    techCategory: "Tempo",
  },

  "ToT - MidComfy": {
    displayName: "MidComfy",
    playlistId: makePlaylistId("01HM4203SPHDAP94MS02S49JC6"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5755 - ToT - MidComfy.bplist",
    speedCategory: "Mid",
    techCategory: "Comfy",
  },
  "ToT - MidTech": {
    displayName: "MidTech",
    playlistId: makePlaylistId("01HK8XCHRK0NSY3PNTPPBJ0X1F"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5765 - ToT - MidTech.bplist",
    speedCategory: "Mid",
    techCategory: "Tech",
  },
  "ToT - MidHitech": {
    displayName: "MidHitech",
    playlistId: makePlaylistId("01HK8XCHPPDM9XD77EGJCVTA81"),
    pathMd: "/migrated/playlists-md/",
    path: "/migrated/playlists/",
    fileName: "5766 - ToT - MidHitech.bplist",
    speedCategory: "Mid",
    techCategory: "Hitech",
  },
  "ToT - MidAnglehell": {
    displayName: "MidAnglehell",
    playlistId: makePlaylistId("01HM4203SHXNGDMWZVY685MDVR"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5767 - ToT - MidAnglehell.bplist",
    speedCategory: "Mid",
    techCategory: "Anglehell",
  },
  "ToT - MidTempo": {
    displayName: "MidTempo",
    playlistId: makePlaylistId("01HM7KRRZ7H0XFCNX8D9WY5ATP"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5768 - ToT - MidTempo.bplist",
    speedCategory: "Mid",
    techCategory: "Tempo",
  },

  "ToT - FasComfy": {
    displayName: "FasComfy",
    playlistId: makePlaylistId("01HM4203RT18K3SZ4VEJ79E12G"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5854 - ToT - FasComfy.bplist",
    speedCategory: "Fas",
    techCategory: "Comfy",
  },
  "ToT - FasTech": {
    displayName: "FasTech",
    playlistId: makePlaylistId("01HM4203RR9TZ2KAYG3BQ4ZJRV"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5855 - ToT - FasTech.bplist",
    speedCategory: "Fas",
    techCategory: "Tech",
  },
  "ToT - FasHitech": {
    displayName: "FasHitech",
    playlistId: makePlaylistId("01HM4203S214YAVEJ6NWWE3KF0"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5856 - ToT - FasHitech.bplist",
    speedCategory: "Fas",
    techCategory: "Hitech",
  },
  "ToT - FasAnglehell": {
    displayName: "FasAnglehell",
    playlistId: makePlaylistId("01HM4203SQNWEVXQ5KPVXY8QHJ"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5857 - ToT - FasAnglehell.bplist",
    speedCategory: "Fas",
    techCategory: "Anglehell",
  },
  "ToT - FasTempo": {
    displayName: "FasTempo",
    playlistId: makePlaylistId("01HS9TYNFZB2XES1K56E8FT6CR"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5858 - ToT - FasTempo.bplist",
    speedCategory: "Fas",
    techCategory: "Tempo",
  },

  "ToT - SonicComfy": {
    displayName: "SonicComfy",
    playlistId: makePlaylistId("01HM7KRS01RR2YY4PSBN4F7VE5"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5945 - ToT - SonicComfy.bplist",
    speedCategory: "Sonic",
    techCategory: "Comfy",
  },
  "ToT - SonicTech": {
    displayName: "SonicTech",
    playlistId: makePlaylistId("01HM4203SGVE0M1ZBPQ89F42K7"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5955 - ToT - SonicTech.bplist",
    speedCategory: "Sonic",
    techCategory: "Tech",
  },
  "ToT - SonicHitech": {
    displayName: "SonicHitech",
    playlistId: makePlaylistId("01HM7KRRZGV8Q5F7FXDK9FDGYG"),
    path: "/migrated/playlists/",
    pathMd: "/migrated/playlists-md/",
    fileName: "5956 - ToT - SonicHitech.bplist",
    speedCategory: "Sonic",
    techCategory: "Hitech",
  },
};

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
