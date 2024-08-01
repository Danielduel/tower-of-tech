import { VisualNovelContainer } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { latestPlaylistReleaseUrl } from "@/packages/utils/constants.ts";
import { forwardRef } from "react";

export const Download = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <VisualNovelContainer ref={ref}>
      Here they are
      <a
        download
        href={latestPlaylistReleaseUrl}
      >
        <img src="./" />
      </a>
    </VisualNovelContainer>
  );
});
