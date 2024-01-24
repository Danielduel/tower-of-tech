import { VisualNovelStepExplanation } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { VisualNovelDivider } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import {
  VisualNovelStep,
} from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { forwardRef } from "react";

export const History = forwardRef<HTMLDivElement>((_, ref) => {
  return (
    <VisualNovelStep ref={ref}>
      Hi,
      <br />
      The easiest way to understand this project will be reading this overview
      how it originated and it is closely related with how I've developed as a
      player.
      <VisualNovelStepExplanation>
        Treat years as very rough estimates, a storytelling, I am not sure about
        most of them.
      </VisualNovelStepExplanation>
      <VisualNovelDivider />
      I've started playing BeatSaber on 29th May of 2018.
      <br />
      At first I was bottomstream player and complex streams were my favorite.
      <br />
      In the world of linear streams, tech came to me as something very
      refreshing. I was superinspired to learn this new thing (late 2020).
      <VisualNovelStepExplanation>
        Tech began sometime in 2019, I was quite late to discover how fun it is.
      </VisualNovelStepExplanation>
      <VisualNovelDivider />
      I've started collecting maps to keep those maps that I found fun, and
      those that seemed impossible, but looked extremely cool.
      <VisualNovelDivider />
      Later, I've started passing those maps that I thought will be impossible
      and I was moving them into split categories.
      <VisualNovelDivider />
      Time passed, I became progressively better, so I wanted to compete with
      much better players that weren't specialising in tech (early 2021). This
      has shown me one thing - no matter how well do you understand the flow, if
      somebody is fast and accurate - they can negate most of complexity and
      still get a better score with mistakes than your full combo run.
      <VisualNovelDivider />
      I started to practice slower tech to improve my accuracy, I slowed down,
      I've started to use fast motion only when it was necessary and I've
      started to split maps into playlists like "To fullcombo", "To fullcombo
      95", ...
      <VisualNovelDivider />
      Later, some maps were way too hard to fullcombo, but were great to
      practice tech acc in how gimmicky they were so I've created "AccTech" to
      put there maps that are hard but they have a rich variety of angles to
      practice on.
      <VisualNovelDivider />
      As the theme goes here - after some time even those started to feel easy.
      People who knew me sometimes asked me if I can share those playlists and
      every time I had to explain what each playlist includes, so I've started
      to split AccTech further into AccHitech to draw the line between normal
      tech and heavy tech... then AccAnglehell, then further...
      <VisualNovelDivider />
      At some point I got a valid critique that the "Acc" doesn't feel "Accable"
      to people. Instead of telling them that it doesn't feel accable because it
      is the point of that playlist (because accable maps landed into To
      fullcombo 95 or 98) to practice on those maps to make them feel accable -
      I've took faster maps from Acc and created Mid, so MidTech, MidHitech.
      <VisualNovelDivider />
      Then I've met few beginners and I really wanted to show them tech, and
      because I've forgot how hard it was few years ago - it was very suprising
      that people had problems with passing those maps. So there, Adept (Adep)
      level has been created.
      <VisualNovelDivider />
      Mid has divided into Fast (Fas), then into Sonic. Some Anglehells were
      very special, so I've split them into Tempo and also some Techs were a bit
      less techy, so I've created Comfy and Chill (but Chill got quickly removed
      because it was just too simple).
    </VisualNovelStep>
  );
});
