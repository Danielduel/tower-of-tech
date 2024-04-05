import { VisualNovelContainer } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { latestPlaylistReleaseUrl } from "@/packages/utils/constants.ts";

export default function Download() {
  return (
    <VisualNovelContainer>
      Here they are
      <a
        download
        href={latestPlaylistReleaseUrl}
      >
        <img src="./" />
      </a>
    </VisualNovelContainer>
  );
}
