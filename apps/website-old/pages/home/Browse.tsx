import { forwardRef } from "react";
import {
  VisualNovelDivider,
  VisualNovelStep,
  VisualNovelStepExplanation,
  VisualNovelStepInlineATag,
} from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { ToTPlaylistList } from "@/apps/website/pages/home/PlaylistInstallGuide.tsx";
import { latestPlaylistReleaseUrl } from "@/packages/utils/constants.ts";

export const Browse = forwardRef<HTMLDivElement>(
  (_, ref) => {
    return (
      <VisualNovelStep ref={ref}>
        <VisualNovelStepExplanation>
          First segment:<br />
          <i className="text-[#5e81ac] font-bold highlight pr-1">Adep</i>,&nbsp;
          <i className="text-[#88c0d0] font-bold highlight pr-1">
            Acc
          </i>,&nbsp;<i className="text-[#a3be8c] font-bold highlight pr-1">
            Mid
          </i>,&nbsp;<i className="text-[#ebcb8b] font-bold highlight pr-1">
            Fas
          </i>,&nbsp;<i className="text-[#d08770] font-bold highlight pr-1">
            Sonic
          </i>&nbsp;are pacings - "speedyness".<br />
          Those roughly translate to <i className="text-[#5e81ac] font-bold highlight pr-1">&gt;4</i>,{" "}
          <i className="text-[#88c0d0] font-bold highlight pr-1">&gt;6</i>,{" "}
          <i className="text-[#a3be8c] font-bold highlight pr-1">&gt;8</i>,{" "}
          <i className="text-[#ebcb8b] font-bold highlight pr-1">&gt;10</i>,{" "}
          <i className="text-[#d08770] font-bold highlight pr-1">10+</i> nps.<br />
          <i className="text-[#5e81ac] font-bold highlight pr-1">Adep</i>{" "}
          is great for beginners and people who work on fundamentals.<br />
          <i className="text-[#88c0d0] font-bold highlight pr-1">
            Acc
          </i>{" "}
          gives a slight challenge for accing, good for semiadvanced players.
          <br />
          <br />
          Second segment:<br />
          <i className="font-bold highlight pr-1">Comfy</i>, <i className="font-bold highlight pr-1">Tech</i>,{" "}
          <i className="font-bold highlight pr-1">Hitech</i>, <i className="font-bold highlight pr-1">Anglehell</i>,
          {" "}
          <i className="font-bold highlight pr-1">Tempo</i> are complexities.<br />
          If you are new to BeatSaber or you are a linear player who want to practice tech - I recommend starting with
          {" "}
          <i className="font-bold highlight pr-1">Comfy</i>.<br />
          <i className="font-bold highlight pr-1">Tech</i> is a bit more complex than{" "}
          <i className="font-bold highlight pr-1">Comfy</i>, great for semiadvanced tech crowd.<br />
          <i className="font-bold highlight pr-1">Hitech</i> is much more complex than{" "}
          <i className="font-bold highlight pr-1">Tech</i>, targets superadvanced tech players.<br />
          <i className="font-bold highlight pr-1">Anglehell</i> and <i className="font-bold highlight pr-1">Tempo</i>
          {" "}
          are especially hard cases of <i className="font-bold highlight pr-1">Hitech</i>.
        </VisualNovelStepExplanation>
        <VisualNovelDivider />
        <VisualNovelStepInlineATag
          download
          href={latestPlaylistReleaseUrl}
          children="Download playlist archive"
        />
        <VisualNovelDivider />
        <ToTPlaylistList />
      </VisualNovelStep>
    );
  },
);
