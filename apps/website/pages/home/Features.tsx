import {
  VisualNovelStep,
  VisualNovelStepExplanation,
  VisualNovelStepLink,
} from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { forwardRef } from "react";

export const Features = forwardRef<HTMLDivElement>((_, ref) => {
  // links.api.v1.auth.discord.oauth.signIn()

  return (
    <VisualNovelStep ref={ref}>
      <VisualNovelStepExplanation>
        <VisualNovelStepLink to="#">Dynamic playlist</VisualNovelStepLink>
        Playlist has 1000 maps and you don't want it all at once, but few maps a time.<br />
        This playlist tracks your progress and hides/presents maps to you.<br />
        Requires signing in and enabling integration with BeatLeader.<br />
        It will start hiding maps once you freshly play them.<br />
      </VisualNovelStepExplanation>
    </VisualNovelStep>
  );
});
