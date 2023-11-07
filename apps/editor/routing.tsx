import { Route, Routes } from "react-router-dom";
import { PlaylistRouting } from "./pages/playlist/PlaylistRouting.tsx";
import { MapRouting } from "./pages/map/MapRouting.tsx";
import NoPage from "./pages/NoPage.tsx";

export const Routing = () => {
  return (
    <Routes>
      <Route path="playlist/*" element={<PlaylistRouting />} />
      <Route path="map/*" element={<MapRouting />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  );
}
