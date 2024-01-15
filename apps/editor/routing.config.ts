export const routing = {
  root: "*",
  globalNoPage: "*",

  home: {
    root: "home/*",
    more: "more",
    download: "download",
    about: "about",
    browse: "browse",
    playlistInstallGuide: {
      root: "playlist-install-guide/",
      askAboutPlatform: "ask-about-platform",
      modAssistant: "mod-assistant",
      pcvrSteam: "pcvr-steam",
      pcvrSteamManualDownload: "pcvr-steam-manual-download",
      pcvrSteamManualLocateFolder: "pcvr-steam-manual-locate-folder",
      pcvrSteamManualMoveAndExtract: "pcvr-steam-manual-move-and-extract",
      pcvrSteamManualPostInstallationCheck:
        "pcvr-steam-manual-post-installation-check",
    },
  },

  snipe: {
    root: "snipe/*",
  },

  editor: {
    root: "editor/*",
    playlist: {
      root: "playlist/*",
    },
    map: {
      root: "map/*",
    },
  },
};

export const links = {
  home: {
    root: "/",
    playlistInstallGuide: {
      root: "/home/playlist-install-guide/",
      askAboutPlatform: "/home/playlist-install-guide/ask-about-platform",
      modAssistant: "/home/playlist-install-guide/mod-assistant",
      pcvrSteam: "/home/playlist-install-guide/pcvr-steam",
      pcvrSteamManualDownload:
        "/home/playlist-install-guide/pcvr-steam-manual-download",
      pcvrSteamManualLocateFolder:
        "/home/playlist-install-guide/pcvr-steam-manual-locate-folder",
      pcvrSteamManualMoveAndExtract:
        "/home/playlist-install-guide/pcvr-steam-manual-move-and-extract",
      pcvrSteamManualPostInstallationCheck:
        "/home/playlist-install-guide/pcvr-steam-manual-post-installation-check",
    },
    download: "/home/download",
    more: "/home/more",
    about: "/home/about",
    browse: "/home/browse",
  },

  editor: {
    playlist: {
      list: "/editor/playlist/list",
    },
    map: {
      list: "/editor/map/list",
    },
  },
};
