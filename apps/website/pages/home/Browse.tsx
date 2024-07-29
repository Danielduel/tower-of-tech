import {
  VisualNovelDivider,
  VisualNovelStep,
  VisualNovelStepExplanation,
  VisualNovelStepInlineATag,
} from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { ToTPlaylistList } from "@/apps/website/pages/home/PlaylistInstallGuide.tsx";
import { forwardRef } from "react";
import { latestPlaylistReleaseUrl } from "@/packages/utils/constants.ts";

export const Browse = forwardRef<HTMLDivElement>(
  (_, ref) => {
    return (
      <VisualNovelStep ref={ref}>
        <VisualNovelStepExplanation>
          First segment:<br />
          <i className="text-[#5e81ac] font-bold highlight">Adep</i>,&nbsp;
          <i className="text-[#88c0d0] font-bold highlight">
            Acc
          </i>,&nbsp;<i className="text-[#a3be8c] font-bold highlight">
            Mid
          </i>,&nbsp;<i className="text-[#ebcb8b] font-bold highlight">
            Fas
          </i>,&nbsp;<i className="text-[#d08770] font-bold highlight">
            Sonic
          </i>&nbsp;are pacings - "speedyness".<br />
          Those roughly translate to{" "}
          <i className="text-[#5e81ac] font-bold highlight">&gt;4</i>,{" "}
          <i className="text-[#88c0d0] font-bold highlight">&gt;6</i>,{" "}
          <i className="text-[#a3be8c] font-bold highlight">&gt;8</i>,{" "}
          <i className="text-[#ebcb8b] font-bold highlight">&gt;10</i>,{" "}
          <i className="text-[#d08770] font-bold highlight">10+</i> nps.<br />
          <i className="text-[#5e81ac] font-bold highlight">Adep</i>{" "}
          is great for beginners and people who work on fundamentals.<br />
          <i className="text-[#88c0d0] font-bold highlight">
            Acc
          </i>{" "}
          gives a slight challenge for accing, good for semiadvanced players.
          <br />
          <br />
          Second segment:<br />
          <i className="font-bold highlight">Comfy</i>,{" "}
          <i className="font-bold highlight">Tech</i>,{" "}
          <i className="font-bold highlight">Hitech</i>,{" "}
          <i className="font-bold highlight">Anglehell</i>,{" "}
          <i className="font-bold highlight">Tempo</i> are complexities.<br />
          If you are new to BeatSaber or you are a linear player who want to
          practice tech - I recommend starting with{" "}
          <i className="font-bold highlight">Comfy</i>.<br />
          <i className="font-bold highlight">Tech</i> is a bit more complex than
          {" "}
          <i className="font-bold highlight">Comfy</i>, great for semiadvanced
          tech crowd.<br />
          <i className="font-bold highlight">Hitech</i>{" "}
          is much more complex than{" "}
          <i className="font-bold highlight">Tech</i>, targets superadvanced
          tech players.<br />
          <i className="font-bold highlight">Anglehell</i> and{" "}
          <i className="font-bold highlight">Tempo</i>{" "}
          are especially hard cases of{" "}
          <i className="font-bold highlight">Hitech</i>.
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
