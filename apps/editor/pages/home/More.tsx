import { VisualNovelStepExplanation } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { VisualNovelStepLink } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { VisualNovelDivider } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import {
  VisualNovelStep,
} from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { links } from "@/apps/editor/routing.config.ts";
import { forwardRef } from "react";

export const More = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <VisualNovelStep ref={ref}>
      Each playlist name can be divided into 2 parts - perceived speed and
      complexity.
      <VisualNovelDivider />
      <hr />
      <VisualNovelDivider />
      The speed part:<br />
      Adep, Acc, Mid, Fas, Sonic - are based on burstable swings per second,
      which roughly translated to nps would be...<br />
      <br />
      4nps for Adep<br />
      4-6nps for Acc<br />
      6-8nps for Mid<br />
      8-11nps for Fas<br />
      11+nps for Sonic<br />
      <VisualNovelDivider />
      <hr />
      <VisualNovelDivider />
      The complexity part:<br />
      Comfy, Tech, Hitech, Anglehell, Tempo are more subjective:<br />
      <br />
      <i>Comfy</i>{" "}
      consists mostly of simple/comfy moves, but it has sections which players
      new to tech would find harder than usual.
      <VisualNovelStepExplanation>
        Speed players can reduce their amount of what they call "shitmisses" by
        playing MidComfy/FasComfy playlists.
      </VisualNovelStepExplanation>
      <br />
      <i>Tech</i>{" "}
      introduces a lot of sidecuts, returns, bottomstreams, inlines, nonlinear
      jumps, ocassional palmups and rolls that aren't essential to the
      flow.<br />
      <br />
      <i>Hitech</i>{" "}
      constists of moves that tech had, but it puts them into much longer and
      harder to read combinations.<br />
      <br />
      <i>Anglehell</i>{" "}
      constantly rotates blocks, it is heavier form of Hitech in the way that
      you have to pay attention to things like an ocassional sidecut inside a
      bottomstream or koji patterns.<br />
      <br />
      <i>Tempo</i>{" "}
      is not necessarily harder than Anglehell, it is easier to fullcombo if you
      absolutely feel the flow, but one mistake often leads to a quick fail.
      <VisualNovelStepExplanation>
        As Anglehell was about making each block hard, Tempo is more about
        navigating in a giant web of possible patterns.
      </VisualNovelStepExplanation>
      <VisualNovelDivider />
      <hr />
      <VisualNovelDivider />
      Now, since this naming convention is often confusing, there are talks
      about how to rename those and to rework the gradation.
      <VisualNovelDivider />
      <VisualNovelStepLink
        to={links.home.history}
        children="Tell me even more"
      />
    </VisualNovelStep>
  );
});
