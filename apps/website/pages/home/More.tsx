import { VisualNovelStepExplanation } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { VisualNovelStepLink } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { VisualNovelDivider } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { VisualNovelStep } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { links } from "@/apps/website/routing.config.ts";
import { forwardRef } from "react";

export const More = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <VisualNovelStep ref={ref}>
      Each playlist name can be divided into 2 parts - perceived speed and complexity.
      <VisualNovelDivider />
      <hr />
      <VisualNovelDivider />
      The speed part:<br />
      <VisualNovelStepExplanation>
        <i className="text-[#5e81ac] font-bold highlight pr-1">Adep</i>,&nbsp;
        <i className="text-[#88c0d0] font-bold highlight pr-1">
          Acc
        </i>,&nbsp;<i className="text-[#a3be8c] font-bold highlight pr-1">
          Mid
        </i>,&nbsp;<i className="text-[#ebcb8b] font-bold highlight pr-1">
          Fas
        </i>,&nbsp;<i className="text-[#d08770] font-bold highlight pr-1">
          Sonic
        </i>{" "}
        sort pacings, the "speedyness"<br />
        <br />
        <i className="text-[#5e81ac] font-bold highlight pr-1">Adep</i> is less than 4nps<br className="mb-1" />
        <i className="text-[#88c0d0] font-bold highlight pr-1">Acc</i> is less than 6nps<br className="m-1" />
        <i className="text-[#a3be8c] font-bold highlight pr-1">Mid</i> is less than 8nps<br className="m-1" />
        <i className="text-[#ebcb8b] font-bold highlight pr-1">Fas</i> is less than 10-11nps<br className="m-1" />
        <i className="text-[#d08770] font-bold highlight pr-1">Sonic</i> is anything more than Fas<br className="m-1" />
        <VisualNovelStepExplanation>
          With few details:<br />
          Bursts/jumps/empty spaces move a map to faster category.<br />
          Sliders/dotspam move a map to slower category.<br />
        </VisualNovelStepExplanation>
      </VisualNovelStepExplanation>

      <VisualNovelDivider />
      <hr />
      <VisualNovelDivider />
      The complexity part:<br />
      <VisualNovelStepExplanation>
        <i className="font-bold highlight pr-1">Comfy</i>, <i className="font-bold highlight pr-1">Tech</i>,{" "}
        <i className="font-bold highlight pr-1">Hitech</i>, <i className="font-bold highlight pr-1">Anglehell</i>,{" "}
        <i className="font-bold highlight pr-1">Tempo</i> describe complexity, the "techyness"<br />
        <br />
        <i className="font-bold highlight pr-1">Comfy</i>{" "}
        consists mostly of simple/comfy moves, but it has sections which players new to tech would find harder than
        usual.
        <VisualNovelStepExplanation>
          Speed players can reduce their amount of what they call "shitmisses" by playing MidComfy/FasComfy playlists.
        </VisualNovelStepExplanation>
        <br />
        <i className="font-bold highlight pr-1">Tech</i>{" "}
        introduces a lot of sidecuts, returns, bottomstreams, inlines, nonlinear jumps, ocassional palmups and rolls
        that aren't essential to the flow.<br />
        <br />
        <i className="font-bold highlight pr-1">Hitech</i>{" "}
        constists of moves that tech had, but it puts them into much longer and harder to read combinations.<br />
        <br />
        <i className="font-bold highlight pr-1">Anglehell</i>{" "}
        constantly rotates blocks, it is heavier form of Hitech in the way that you have to pay attention to things like
        an ocassional sidecut inside a bottomstream or koji patterns.<br />
        <br />
        <i className="font-bold highlight pr-1">Tempo</i>{" "}
        is not necessarily harder than Anglehell, it is easier to fullcombo if you absolutely feel the flow, but one
        mistake often leads to a quick fail.
        <VisualNovelStepExplanation>
          As Anglehell was about making each block hard, Tempo is more about navigating in a giant web of possible
          patterns.
        </VisualNovelStepExplanation>
      </VisualNovelStepExplanation>
      <VisualNovelDivider />
      <hr />
      <VisualNovelDivider />
      <VisualNovelStepLink
        to={links.home.history}
        children="Tell me even more"
      />
    </VisualNovelStep>
  );
});
