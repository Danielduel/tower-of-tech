import { Route, Routes, useLocation } from "react-router-dom";
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
import { CSSTransition, SwitchTransition } from "react-transition-group";
import {
  PlaylistInstallGuideModAssistant,
  PlaylistInstallGuidePCVRSteam,
  PlaylistInstallGuidePCVRSteamManualInstallMods,
  PlaylistInstallGuidePlatform,
} from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";
import { PlaylistInstallGuidePCVRSteamManualDownload } from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";
import { PlaylistInstallGuidePCVRSteamManualLocateFolder } from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";
import { PlaylistInstallGuidePCVRSteamManualMoveAndExtract } from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";
import { PlaylistInstallGuidePCVRSteamManualPostInstallationCheck } from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";
import { PlaylistInstallGuidePCVRSteamCustom } from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";
import { PlaylistInstallGuidePCVRPostInstallationCongratulations } from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";
import { History } from "@/apps/editor/pages/home/History.tsx";

export const Routing = () => {
  const location = useLocation();

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition key={location.key} classNames="slide" timeout={100}>
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
              element={<MainLayoutShell Component={Download} />}
            />
            <Route
              path={routing.home.browse}
              element={<MainLayoutShell Component={Browse} />}
            />
            <Route
              path={routing.home.more}
              element={<MainLayoutShell Component={More} />}
            />
            <Route
              path={routing.home.history}
              element={<MainLayoutShell Component={History} />}
            />
            <Route path={routing.home.playlistInstallGuide.root}>
              <Route
                path={routing.home.playlistInstallGuide.modAssistant}
                element={
                  <MainLayoutShell
                    Component={PlaylistInstallGuideModAssistant}
                  />
                }
              />
              <Route
                path={routing.home.playlistInstallGuide.pcvrSteamCustom}
                element={
                  <MainLayoutShell
                    Component={PlaylistInstallGuidePCVRSteamCustom}
                  />
                }
              />
              <Route
                path={routing.home.playlistInstallGuide.pcvrSteam}
                element={
                  <MainLayoutShell
                    Component={PlaylistInstallGuidePCVRSteam}
                  />
                }
              />
              <Route
                path={routing.home.playlistInstallGuide
                  .pcvrSteamManualDownload}
                element={
                  <MainLayoutShell
                    Component={PlaylistInstallGuidePCVRSteamManualDownload}
                  />
                }
              />
              <Route
                path={routing.home.playlistInstallGuide
                  .pcvrSteamManualLocateFolder}
                element={
                  <MainLayoutShell
                    Component={PlaylistInstallGuidePCVRSteamManualLocateFolder}
                  />
                }
              />
              <Route
                path={routing.home.playlistInstallGuide
                  .pcvrSteamManualPostInstallationCheck}
                element={
                  <MainLayoutShell
                    Component={PlaylistInstallGuidePCVRSteamManualPostInstallationCheck}
                  />
                }
              />
              <Route
                path={routing.home.playlistInstallGuide
                  .pcvrSteamManualMoveAndExtract}
                element={
                  <MainLayoutShell
                    Component={PlaylistInstallGuidePCVRSteamManualMoveAndExtract}
                  />
                }
              />
              <Route
                path={routing.home.playlistInstallGuide
                  .pcvrSteamManualInstallMods}
                element={
                  <MainLayoutShell
                    Component={PlaylistInstallGuidePCVRSteamManualInstallMods}
                  />
                }
              />
              <Route
                path={routing.home.playlistInstallGuide
                  .pcvrSteamManualPostInstallationCongratulations}
                element={
                  <MainLayoutShell
                    Component={PlaylistInstallGuidePCVRPostInstallationCongratulations}
                  />
                }
              />
              <Route
                path={routing.home.playlistInstallGuide.askAboutPlatform}
                element={
                  <MainLayoutShell Component={PlaylistInstallGuidePlatform} />
                }
              />
              <Route
                index
                element={
                  <MainLayoutShell Component={PlaylistInstallGuidePlatform} />
                }
              />
            </Route>
          </Route>
          <Route path={routing.snipe.root}>
            <Route path={routing.globalNoPage} element={<SnipeIndex />} />
          </Route>
          <Route
            path={routing.root}
            element={<MainLayoutShell Component={Index} />}
          />
        </Routes>
      </CSSTransition>
    </SwitchTransition>
  );
};
