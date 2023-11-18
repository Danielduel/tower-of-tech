import { Route, Routes } from "react-router-dom";
import { PlaylistRouting } from "./pages/editor/playlist/PlaylistRouting.tsx";
import { MapRouting } from "./pages/editor/map/MapRouting.tsx";
import NoPage from "./pages/editor/NoPage.tsx";
import Index from "./pages/index.tsx";
import { EditorLayoutShell } from "./components/layouts/EditorLayout.tsx";
import { MainLayoutShell } from "@/apps/editor/components/layouts/MainLayout.tsx";
import { routing } from "@/apps/editor/routing.config.ts";
import { Browse } from "./pages/home/Browse.tsx";
import { More } from "./pages/home/More.tsx";
import Download from "@/apps/editor/pages/home/Download.tsx";

export const Routing = () => {
  return (
    <Routes>
      <Route path={routing.editor.root}>
        <Route path={routing.editor.playlist.root} element={EditorLayoutShell(PlaylistRouting)} />
        <Route path={routing.editor.map.root} element={EditorLayoutShell(MapRouting)} />
        <Route path={routing.globalNoPage} element={EditorLayoutShell(NoPage)} />
      </Route>
      <Route path={routing.home.root}>
        <Route path={routing.home.download} element={MainLayoutShell(Download)} />
        <Route path={routing.home.browse} element={MainLayoutShell(Browse)} />
        <Route path={routing.home.more} element={MainLayoutShell(More)} />
      </Route>
      <Route path={routing.root} element={MainLayoutShell(Index)} />
    </Routes>
  );
};
