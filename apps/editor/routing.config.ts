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
    },
  },

  snipe: {
    root: "snipe/*"
  },

  editor: {
    root: "editor/*",
    playlist: {
      root: "playlist/*"
    },
    map: {
      root: "map/*"
    }
  }

}

export const links = {
  home: {
    root: "/",
    playlistInstallGuide: {
      root: "/home/playlist-install-guide/",
      askAboutPlatform: "/home/playlist-install-guide/ask-about-platform",
      modAssistant: "/home/playlist-install-guide/mod-assistant",
      pcvrSteam: "/home/playlist-install-guide/pcvr-steam",
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
  }
};


