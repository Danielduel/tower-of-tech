export const routing = {
  root: "*",
  globalNoPage: "*",

  home: {
    root: "home/*",
    more: "more",
    history: "history",
    download: "download",
    about: "about",
    browse: "browse",
    playlistInstallGuide: {
      root: "playlist-install-guide/",
      askAboutPlatform: "ask-about-platform",
      modAssistant: "mod-assistant",
      pcvrSteam: "pcvr-steam",
      pcvrSteamCustom: "pcvr-steam-custom",
      pcvrSteamManualDownload: "pcvr-steam-manual-download",
      pcvrSteamManualLocateFolder: "pcvr-steam-manual-locate-folder",
      pcvrSteamManualMoveAndExtract: "pcvr-steam-manual-move-and-extract",
      pcvrSteamManualInstallMods: "pcvr-steam-manual-install-mods",
      pcvrSteamManualPostInstallationCheck:
        "pcvr-steam-manual-post-installation-check",
      pcvrSteamManualPostInstallationCongratulations:
        "pcvr-steam-manual-post-installation-congratulations",
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
      pcvrSteamCustom: "/home/playlist-install-guide/pcvr-steam-custom",
      pcvrSteam: "/home/playlist-install-guide/pcvr-steam",
      pcvrSteamManualDownload:
        "/home/playlist-install-guide/pcvr-steam-manual-download",
      pcvrSteamManualLocateFolder:
        "/home/playlist-install-guide/pcvr-steam-manual-locate-folder",
      pcvrSteamManualMoveAndExtract:
        "/home/playlist-install-guide/pcvr-steam-manual-move-and-extract",
      pcvrSteamManualInstallMods:
        "/home/playlist-install-guide/pcvr-steam-manual-install-mods",
      pcvrSteamManualPostInstallationCheck:
        "/home/playlist-install-guide/pcvr-steam-manual-post-installation-check",
      pcvrSteamManualPostInstallationCongratulations:
        "/home/playlist-install-guide/pcvr-steam-manual-post-installation-congratulations",
    },
    download: "/home/download",
    more: "/home/more",
    history: "/home/history",
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
