import { BrowserRouter, Routes, Route } from "react-router-dom";
import NoPage from "./pages/NoPage.tsx";
import PlaylistList from "./pages/playlist/PlaylistList.tsx";

export default function Routing() {
  return (
    <Routes>
      <Route path="playlist/list" element={<PlaylistList />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  );
};
