import { FC, PropsWithChildren } from "react";
import { Route, Routes } from "react-router-dom";
import { tw } from "@/twind/twind.tsx";
import { MapList } from "./MapList.tsx";

export const MapLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="sub-grid-layout">
      <div className={tw("flex flex-col items-start")}>
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
