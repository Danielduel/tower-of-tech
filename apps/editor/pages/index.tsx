import { FC, PropsWithChildren } from "react";
import { tw } from "@/packages/twind/twind.tsx";
import { Link } from "@/packages/ui/Link.tsx";
import { VisualNovelContainer } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { links } from "@/apps/editor/routing.config.ts";

export default function Index() {
  return (
    <VisualNovelContainer
      title="System"
      links={
        [
          {
            to: links.home.download,
            children: "I want them all"
          },
          {
            to: links.home.more,
            children: "Tell me more"
          },
          {
            to: links.home.browse,
            children: "Let me pick"
          },
          {
            to: links.home.about,
            children: "Who are you?"
          }
        ]
      }
    >
      Welcome to the Tower of Tech, the Beat Saber project that sorts technical maps.
      I have a few playlists for you, they vary in pacing, complexity and density.
    </VisualNovelContainer>
  );
};
