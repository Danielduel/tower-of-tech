import { Route, Routes } from "react-router-dom";
import { PlaylistRouting } from "@/apps/editor/pages/editor/playlist/PlaylistRouting.tsx";
import { MapRouting } from "@/apps/editor/pages/editor/map/MapRouting.tsx";
import NoPage from "@/apps/editor/pages/editor/NoPage.tsx";
import Index from "@/apps/editor/pages/index.tsx";
import { EditorLayoutShell } from "@/apps/editor/components/layouts/EditorLayout.tsx";
import { MainLayoutShell } from "@/apps/editor/components/layouts/MainLayout.tsx";
import { routing } from "@/apps/editor/routing.config.ts";
import { Browse } from "@/apps/editor/pages/home/Browse.tsx";
import { More } from "@/apps/editor/pages/home/More.tsx";
import Download from "@/apps/editor/pages/home/Download.tsx";
import { SnipeIndex } from "@/apps/editor/pages/snipe/index.tsx";
import {
  PlaylistInstallGuideCustom,
  PlaylistInstallGuideModAssistant,
  PlaylistInstallGuidePCVRSteam,
  PlaylistInstallGuidePlatform,
} from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";
import { PlaylistInstallGuidePCVRSteamManualDownload } from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";
import { PlaylistInstallGuidePCVRSteamManualLocateFolder } from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";
import { PlaylistInstallGuidePCVRSteamManualMoveAndExtract } from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";
import { PlaylistInstallGuidePCVRSteamManualPostInstallationCheck } from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";

export const Routing = () => {
  return (
    <Routes>
      <Route path={routing.editor.root}>
        <Route
          path={routing.editor.playlist.root}
          element={EditorLayoutShell(PlaylistRouting)}
        />
        <Route
          path={routing.editor.map.root}
          element={EditorLayoutShell(MapRouting)}
        />
        <Route
          path={routing.globalNoPage}
          element={EditorLayoutShell(NoPage)}
        />
      </Route>
      <Route path={routing.home.root}>
        <Route
          path={routing.home.download}
          element={MainLayoutShell(Download)}
        />
        <Route path={routing.home.browse} element={MainLayoutShell(Browse)} />
        <Route path={routing.home.more} element={MainLayoutShell(More)} />
        <Route path={routing.home.playlistInstallGuide.root}>
          <Route
            path={routing.home.playlistInstallGuide.modAssistant}
            element={MainLayoutShell(PlaylistInstallGuideModAssistant)}
          />
          <Route
            path={routing.home.playlistInstallGuide.custom}
            element={MainLayoutShell(PlaylistInstallGuideCustom)}
          />
          <Route
            path={routing.home.playlistInstallGuide.pcvrSteam}
            element={MainLayoutShell(PlaylistInstallGuidePCVRSteam)}
          />
          <Route
            path={routing.home.playlistInstallGuide.pcvrSteamManualDownload}
            element={MainLayoutShell(
              PlaylistInstallGuidePCVRSteamManualDownload,
            )}
          />
          <Route
            path={routing.home.playlistInstallGuide.pcvrSteamManualLocateFolder}
            element={MainLayoutShell(
              PlaylistInstallGuidePCVRSteamManualLocateFolder,
            )}
          />
          <Route
            path={routing.home.playlistInstallGuide
              .pcvrSteamManualPostInstallationCheck}
            element={MainLayoutShell(
              PlaylistInstallGuidePCVRSteamManualPostInstallationCheck,
            )}
          />
          <Route
            path={routing.home.playlistInstallGuide
              .pcvrSteamManualMoveAndExtract}
            element={MainLayoutShell(
              PlaylistInstallGuidePCVRSteamManualMoveAndExtract,
            )}
          />
          <Route
            path={routing.home.playlistInstallGuide.askAboutPlatform}
            element={MainLayoutShell(PlaylistInstallGuidePlatform)}
          />
          <Route
            index
            element={MainLayoutShell(PlaylistInstallGuidePlatform)}
          />
        </Route>
      </Route>
      <Route path={routing.snipe.root}>
        <Route path={routing.globalNoPage} element={<SnipeIndex />} />
      </Route>
      <Route path={routing.root} element={MainLayoutShell(Index)} />
    </Routes>
  );
};
