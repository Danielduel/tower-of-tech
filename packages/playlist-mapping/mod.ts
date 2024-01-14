export const playlistMapping: Record<string, {
  displayName: string,
  apiDownloadPath: string,
  speedCategory: "Adep" | "Acc" | "Mid" | "Fas" | "Sonic" | "Other" | "Legacy",
  techCategory: "Chill" | "Comfy" | "Tech" | "Hitech" | "Anglehell" | "Tempo" | "Other" | "Legacy"
}> = {
  "ToT - AdepComfy": {
    displayName: "AdepComfy",
    apiDownloadPath: "/api/v1/playlist/get/01HK8XCHRH8RDXEEP9F4211NVG",
    speedCategory: "Adep",
    techCategory: "Comfy"
  },
  "ToT - AdepTech": {
    displayName: "AdepTech",
    apiDownloadPath: "/api/v1/playlist/get/01HK8XCHRJMANCHBSA0CVA354H",
    speedCategory: "Adep",
    techCategory: "Tech"
  },
  "ToT - AdepHitech": {
    displayName: "AdepHitech",
    apiDownloadPath: "/api/v1/playlist/get/01HK8XCHRNPHBZSJMKFWBPKD32",
    speedCategory: "Adep",
    techCategory: "Hitech"
  },
  "ToT - AdepAnglehell": {
    displayName: "AdepAnglehell",
    apiDownloadPath: "/api/v1/playlist/get/01HM2VT1NN91NZM8C9AKVMC574",
    speedCategory: "Adep",
    techCategory: "Anglehell"
  },
  "ToT - AdepTempo": {
    displayName: "AdepTempo",
    apiDownloadPath: "/api/v1/playlist/get/01HM2VT1P090DFVWHNYP2X2A6A",
    speedCategory: "Adep",
    techCategory: "Tempo"
  },


  "ToT - AccComfy": {
    displayName: "AccComfy",
    apiDownloadPath: "/api/v1/playlist/get/01HK8XCHR9VPKXQ898F7TPWVFM",
    speedCategory: "Acc",
    techCategory: "Comfy"
  },
  "ToT - AccTech": {
    displayName: "AccTech",
    apiDownloadPath: "/api/v1/playlist/get/01HK8XCHQ6KFWB4MRA796Q0245",
    speedCategory: "Acc",
    techCategory: "Tech"
  },
  "ToT - AccHitech": {
    displayName: "AccHitech",
    apiDownloadPath: "/api/v1/playlist/get/01HK8XCHRDHER45YMZ7XDS0RZ6",
    speedCategory: "Acc",
    techCategory: "Hitech"
  },
  "ToT - AccAnglehell": {
    displayName: "AccAnglehell",
    apiDownloadPath: "/api/v1/playlist/get/01HK8XCHQCFJCC8B6BJNY2F0A1",
    speedCategory: "Acc",
    techCategory: "Anglehell"
  },


  "ToT - MidComfy": {
    displayName: "MidComfy",
    apiDownloadPath: "/api/v1/playlist/get/01HM2VT1PXDYZ99YB41JX42H44",
    speedCategory: "Mid",
    techCategory: "Comfy"
  },
  "ToT - MidTech": {
    displayName: "MidTech",
    apiDownloadPath: "/api/v1/playlist/get/01HK8XCHRK0NSY3PNTPPBJ0X1F",
    speedCategory: "Mid",
    techCategory: "Tech"
  },
  "ToT - MidHitech": {
    displayName: "MidHitech",
    apiDownloadPath: "/api/v1/playlist/get/01HK8XCHPPDM9XD77EGJCVTA81",
    speedCategory: "Mid",
    techCategory: "Hitech"
  },
  "ToT - MidAnglehell": {
    displayName: "MidAnglehell",
    apiDownloadPath: "/api/v1/playlist/get/01HM2VT1P9T6CRAWW84SDP3P3E",
    speedCategory: "Mid",
    techCategory: "Anglehell"
  },

  "ToT - FasComfy": {
    displayName: "FasComfy",
    apiDownloadPath: "/api/v1/playlist/get/01HM2VT1NF4D6YKP6SX56WXQF7",
    speedCategory: "Fas",
    techCategory: "Comfy"
  },
  "ToT - FasTech": {
    displayName: "FasTech",
    apiDownloadPath: "/api/v1/playlist/get/01HM2VT1NEQ9VTN356P6XWE0MB",
    speedCategory: "Fas",
    techCategory: "Tech"
  },
  "ToT - FasHitech": {
    displayName: "FasHitech",
    apiDownloadPath: "/api/v1/playlist/get/01HM2VT1NTZCH4M2ZKBM934ZRS",
    speedCategory: "Fas",
    techCategory: "Hitech"
  },
  "ToT - FasAnglehell": {
    displayName: "FasAnglehell",
    apiDownloadPath: "/api/v1/playlist/get/01HM2VT1PYMM0P2AQ8HM5RM4W2",
    speedCategory: "Fas",
    techCategory: "Anglehell"
  },


  "ToT - SonicTech": {
    displayName: "SonicTech",
    apiDownloadPath: "/api/v1/playlist/get/01HM2VT1P7Z3ZRCWNPRD61A31J",
    speedCategory: "Sonic",
    techCategory: "Tech"
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
}