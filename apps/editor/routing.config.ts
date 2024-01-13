export const routing = {
  root: "*",
  globalNoPage: "*",

  home: {
    root: "home/*",
    more: "more",
    download: "download",
    about: "about",
    browse: "browse",
    playlistInstallGuide: "playlist-install-guide",
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
    playlistInstallGuide: "/home/playlist-install-guide",
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


