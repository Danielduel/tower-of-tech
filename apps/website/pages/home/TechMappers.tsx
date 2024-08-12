import { FC, forwardRef } from "react";
import { VisualNovelBody, VisualNovelContainer } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import {
  VisualNovelDivider,
  VisualNovelStepExplanation,
  VisualNovelSubBody,
} from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { VisualNovelATag } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { VisualNovelActions } from "@/apps/website/components/containers/VisualNovelBox.tsx";

type CommunityProfileHighlightProps = {
  name: string;
  note?: string;
  twitch?: { name: string; url: string };
  discord?: { name: string; url: string };
  beatsaver?: { name: string; url: string };
};

type CommunityDiscordServerHighlightProps = {
  name: string;
  note: string;
  discord: { name: string; url: string };
};

const CommunityProfileHighlight: FC<CommunityProfileHighlightProps> = ({ name }) => {
  return (
    <div>
      {name}
    </div>
  );
};

const discordLogoLink =
  "https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6ca814282eca7172c6_icon_clyde_white_RGB.svg";

const CommunityDiscordServerHighlight: FC<CommunityDiscordServerHighlightProps> = ({ name, note, discord }) => {
  return (
    <div className="mb-5">
      {name}
      <VisualNovelStepExplanation>
        {note}
      </VisualNovelStepExplanation>
      <VisualNovelActions>
        <VisualNovelATag download={false} href={discord.url}>
          <img src={discordLogoLink} className="w-14 h-14 inline-block text-white" />
          &nbsp; Invite link
        </VisualNovelATag>
      </VisualNovelActions>
    </div>
  );
};

const profiles: CommunityProfileHighlightProps[] = [
  { name: "Alica" },
  { name: "Winteredge" },
  { name: "Tseska" },
  { name: "Eckimlon" },
  { name: "Pleo" },
  { name: "Chrisvenator" },
  { name: "Cush" },
];

const mappingWorkshopNote = `\
Place dedicated to Beat Saber map creation, sharing mapping tips and tricks, and collaboration on maps.
`;

const kpopBeatSaberNote = `\
This is not a strict server for mapping, but you can meet here the most of KPOP tech mappers.
`;

const discordServers: CommunityDiscordServerHighlightProps[] = [
  {
    name: "Mapping Workshop",
    note: mappingWorkshopNote,
    discord: { name: "Mapping Workshop", url: "https://discord.com/invite/BVPWCjXT" },
  },
  {
    name: "KPOP Beat Saber",
    note: kpopBeatSaberNote,
    discord: { name: "KPOP Beat Saber", url: "https://discord.com/invite/hxdKPRyx" },
  },
];

export const TechMappers = forwardRef<HTMLDivElement>(
  (_, ref) => {
    return (
      <VisualNovelContainer ref={ref}>
        <VisualNovelBody>
          Well-known mapping mentors
          <VisualNovelSubBody>
            {profiles.map(CommunityProfileHighlight)}
          </VisualNovelSubBody>
          <VisualNovelDivider />
          Community discord servers
          <VisualNovelSubBody>
            {discordServers.map(CommunityDiscordServerHighlight)}
          </VisualNovelSubBody>
        </VisualNovelBody>
      </VisualNovelContainer>
    );
  },
);
