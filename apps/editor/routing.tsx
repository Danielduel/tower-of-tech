import { Route, Routes } from "react-router-dom";
import { PlaylistRouting } from "./pages/editor/playlist/PlaylistRouting.tsx";
import { MapRouting } from "./pages/editor/map/MapRouting.tsx";
import NoPage from "./pages/editor/NoPage.tsx";
import Index from "./pages/index.tsx";

export const Routing = () => {
  return (
    <Routes>
      <Route path="editor/*">
        <Route path="playlist/*" element={<PlaylistRouting />} />
        <Route path="map/*" element={<MapRouting />} />
        <Route path="*" element={<NoPage />} />
      </Route>
      <Route path="*" element={<Index />} />
    </Routes>
  );
};
