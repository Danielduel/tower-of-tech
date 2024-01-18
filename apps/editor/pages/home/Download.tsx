import { VisualNovelContainer } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { links } from "@/apps/editor/routing.config.ts";
import { latestPlaylistReleaseUrl } from "@/packages/utils/constants.ts";

export default function Download() {
  return (
    <VisualNovelContainer
      title="System"
      links={[
        {
          to: links.home.more,
          children: "Do you have an installation guide?",
        },
        {
          to: links.home.more,
          children: "Tell me more",
        },
        {
          to: links.home.about,
          children: "Who are you?",
        },
      ]}
    >
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
