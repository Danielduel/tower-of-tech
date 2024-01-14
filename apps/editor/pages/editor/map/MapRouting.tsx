import { FC, PropsWithChildren } from "react";
import { Route, Routes } from "react-router-dom";
import { MapList } from "@/apps/editor/pages/editor/map/MapList.tsx";

export const MapLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="sub-grid-layout">
      <div className="flex flex-col items-start">
      </div>
      <div>
        { children }
      </div>
    </div>
  )
}

export const MapRouting = () => {
  return (
    <MapLayout>
      <Routes>
        <Route path="list" element={<MapList />} />
      </Routes>
    </MapLayout>
  )
};
