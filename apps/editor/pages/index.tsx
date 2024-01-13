import {
  VisualNovelActions,
  VisualNovelAnchor,
  VisualNovelBody,
  VisualNovelContainer,
  VisualNovelLink,
} from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { links } from "@/apps/editor/routing.config.ts";

export default function Index() {
  return (
    <VisualNovelContainer>
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
          children="Just give me the those playlists!"
          href="https://github.com/Danielduel/tower-of-tech/releases/download/0.0.9/ToT.zip"
        />
        <VisualNovelLink to={links.home.playlistInstallGuide} children="How to use those playlists?" />
        <VisualNovelLink to={links.home.more} children="Tell me more" />
      </VisualNovelActions>
    </VisualNovelContainer>
  );
}
