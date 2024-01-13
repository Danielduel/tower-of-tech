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

        <a className="animate-bounce border-4 p-20 bg-red-400 text-4xl" href="bsplaylist://playlist/https://danielduel-tot-bot.deno.dev/api/playlist/guild/689050370840068309/channel/1176658722563567759">This button PLEO</a>
      </VisualNovelBody>
      <VisualNovelActions>
        <VisualNovelAnchor
          download
          children="I know what to do, just give me the those playlists!"
          href="https://github.com/Danielduel/tower-of-tech/releases/download/0.0.9/ToT.zip"
        />
        <VisualNovelLink to={links.home.playlistInstallGuide} children="How to use those playlists?" />
        <VisualNovelLink to={links.home.more} children="Tell me more" />
      </VisualNovelActions>
    </VisualNovelContainer>
  );
}
