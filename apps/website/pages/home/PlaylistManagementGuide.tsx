import { forwardRef } from "react";
import {
  VisualNovelDivider,
  VisualNovelStep,
  VisualNovelStepExplanation,
} from "@/apps/website/components/containers/VisualNovelBox.tsx";

export const PlaylistManagementGuidePCVR = forwardRef<HTMLDivElement>(
  (_, ref) => {
    return (
      <VisualNovelStep ref={ref}>
        If you have too many playlists you can organize them in folders
        <VisualNovelStepExplanation>
          Playlist folders are your system folders
        </VisualNovelStepExplanation>
        <VisualNovelDivider />
        Below the mappicker you can see folder icons, hovering your focus over the icon brings up the folder name
        <VisualNovelDivider />
        Clicking it narrows the playlists list to playlists contained by this folder
      </VisualNovelStep>
    );
  },
);
