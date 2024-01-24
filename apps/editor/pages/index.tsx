import {
  VisualNovelActions,
  VisualNovelAnchor,
  VisualNovelBody,
  VisualNovelContainer,
  VisualNovelLink,
} from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { links } from "@/apps/editor/routing.config.ts";
import { latestPlaylistReleaseUrl } from "@/packages/utils/constants.ts";
import { forwardRef } from "react";

const Index = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <VisualNovelContainer ref={ref}>
      <VisualNovelBody>
        Tower of Tech, the Beat Saber project which answers the question of{" "}
        <i>Where is the fun part of Beat Saber?</i>. I have a few playlists for
        you, those playlists cover skillset between{" "}
        <i>I've passed my first Expert map!</i> and{" "}
        <i>Hey, do you have 14nps angle tech for me?</i>.
      </VisualNovelBody>
      <VisualNovelActions>
        <VisualNovelAnchor
          download
          children="I know what to do, just give me those playlists!"
          href={latestPlaylistReleaseUrl}
        />
        <VisualNovelLink
          to={links.home.playlistInstallGuide.root}
          children="How to install those playlists?"
        />
        <VisualNovelLink to={links.home.more} children="Tell me more" />
      </VisualNovelActions>
    </VisualNovelContainer>
  );
});
export default Index;
