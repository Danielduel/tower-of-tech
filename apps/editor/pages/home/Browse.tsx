import { VisualNovelStep } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { ToTPlaylistList } from "@/apps/editor/pages/home/PlaylistInstallGuide.tsx";
import { forwardRef } from "react";

export const Browse = forwardRef<HTMLDivElement>(
  (_, ref) => {
    return (
      <VisualNovelStep ref={ref}>
        <ToTPlaylistList />
      </VisualNovelStep>
    );
  },
);
