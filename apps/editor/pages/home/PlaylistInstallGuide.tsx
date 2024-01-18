import {
  VisualNovelActions,
  VisualNovelBody,
  VisualNovelContainer,
  VisualNovelLink,
} from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import type { LinkProps } from "react-router-dom";
import { links } from "@/apps/editor/routing.config.ts";
import { FC, PropsWithChildren, useMemo, useState } from "react";
import { Image } from "@/apps/editor/components/Image.tsx";
import { Link } from "@/packages/ui/Link.tsx";
import { playlistMapping } from "@/packages/playlist-mapping/mod.ts";
import { latestPlaylistReleaseUrl } from "@/packages/utils/constants.ts";
import { AnchorHTMLAttributes } from "npm:@types/react";

type InstallStepsT = {
  downloading: boolean;
  installation_steam: boolean;
  installation_steam_modassistant: boolean;
  installation_steam_manual_folder: boolean;
  installation_steam_manual_extract: boolean;
  installation_steam_mods: boolean;
  installation_oculus: boolean;
  installation_oculus_standalone: boolean;
};

const Divider = () => <div className="h-6 block" />;

const Step: FC<PropsWithChildren> = (
  { children },
) => {
  return (
    <VisualNovelContainer>
      <VisualNovelBody>
        {children}
      </VisualNovelBody>
      <VisualNovelActions>
        <VisualNovelLink to={links.home.more} children="Tell me more" />
        <VisualNovelLink to={links.home.root} children="Go back" />
      </VisualNovelActions>
    </VisualNovelContainer>
  );
};

const StepExplanation: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="text-lg border-l-2 text-cyan-50 pl-5 mt-2">{children}</div>
  );
};

const StepInlineATag: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (
  props,
) => {
  return (
    <a
      className="border px-4 py-1 box-content h-8 ml-4 mr-1"
      {...props}
    />
  );
};

const StepLink: FC<LinkProps> = (props) => {
  return (
    <Link
      {...props}
      className={`border block w-max min-w-0 px-4 py-1 box-content ml-2 mb-2 !text-2xl no-underline ${props.className}`}
    />
  );
};

export const OneClickAnchor = (
  { href, name }: { href: string; name: string },
) => {
  const [visited, setVisited] = useState(false);
  return (
    <a
      className={"hover:ring-1 ring-white border min-w-0 inline-block px-4 py-1 box-content h-8 ml-2 mb-2 " +
        (visited ? "opacity-50" : "")}
      href={`bsplaylist://playlist/${location.origin}${href}.bplist`}
      onClick={() => setVisited(true)}
    >
      {name}
    </a>
  );
};

export const PlaylistInstallGuideModAssistant = () => {
  const playlistArray = useMemo(() => Object.values(playlistMapping), []);
  return (
    <Step>
      Have fun clicking those
      <Divider />
      {playlistArray.map((x) => (
        <OneClickAnchor
          name={x.displayName}
          href={x.apiDownloadPath}
        />
      ))}
      <Divider />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteam}
        children="Take me back"
      />
    </Step>
  );
};

export const PlaylistInstallGuidePCVRSteamManualDownload = () => {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <Step>
      First, you will need the archive:
      <StepInlineATag
        download
        onClick={() => setDownloaded(true)}
        className="border px-4 py-1 box-content h-8 ml-4"
        href={latestPlaylistReleaseUrl}
      >
        Download playlist archive
      </StepInlineATag>
      <Divider />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteamManualLocateFolder}
        children={downloaded ? "Got it!" : "I already have this"}
      />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteam}
        children="Take me back"
      />
    </Step>
  );
};

export const PlaylistInstallGuidePCVRSteamManualLocateFolder = () => {
  return (
    <Step>
      Go to Beat Saber's folder
      <StepExplanation>
        Open <i>Steam</i>, select <i>Library</i>, right click <i>Beat Saber</i>
        {" "}
        in the library list, select <i>Manage</i> in the dropdown, click{" "}
        <i>Browse local files</i> option
      </StepExplanation>
      <Divider />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteamManualMoveAndExtract}
        children="Done!"
      />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteamManualDownload}
        children="Take me back"
      />
    </Step>
  );
};

export const PlaylistInstallGuidePCVRSteamManualMoveAndExtract = () => {
  return (
    <Step>
      Move the downloaded <i>ToT.zip</i>{" "}
      to the main Beat Saber folder and extract it<br />
      <StepExplanation>
        Move <i>ToT.zip</i> archive from <i>Downloads</i> to your{" "}
        <i>Beat Saber folder</i>. Right click the ToT.zip, depending on your
        system you should have an option to{" "}
        <i>
          extract the archive here
        </i>.
      </StepExplanation>
      <Divider />
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/tot-in-folder.png"
      />
      <Divider />
      <StepLink
        to={links.home.playlistInstallGuide
          .pcvrSteamManualPostInstallationCheck}
        children="Done, how to check if it works?"
      />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteamManualLocateFolder}
        children="Take me back"
      />
    </Step>
  );
};

// You should have <i>Playlists</i> folder with{" "}
//         <i>ToT</i> and <i>ToT Guest</i> which contain a lot of <i>.bplist</i>
//         {" "}
//         files. You can open Beat Saber and check if your Playlists are in the
//         game

export const PlaylistInstallGuidePCVRPostInstallationCongratulations = () => {
  return (
    <Step>
      Congratulations!
      <Divider />
      Those playlists are contantly growing, there are 2 kinds of updates
      <Divider />
      Release updates happening every month or two
      <StepExplanation>
        Those updates are modifying how playlists work and add/remove playlists
        and to use those updates - you have to reinstall playlists
      </StepExplanation>
      <Divider />
      Incremental updates happening few times a week
      <StepExplanation>
        Those updates are modifying the content of playlists and you can fetch
        those via in-game sync button
      </StepExplanation>
      <Divider />
      <StepLink
        to={"#"}
        className="opacity-50 hover:ring-transparent cursor-default"
        children="I have a lot of playlists now, how to manage this"
      />
      <StepLink
        to={"#"}
        className="opacity-50 hover:ring-transparent cursor-default"
        children="Tell me which playlist does what"
      />
    </Step>
  );
};
export const PlaylistInstallGuidePCVRSteamManualPostInstallationCheck = () => {
  return (
    <Step>
      Run the game
      <br />
      <StepExplanation>
        Optional<br />
        If you don't want to start VR - you can add "fpfc" to launch flags to
        Beat Saber in steam so you don't have to get into VR
      </StepExplanation>
      <Divider />

      Pick the community tab in solo mode
      <br />
      <StepExplanation>
        Second from the left - it is this hand with a musical note icon
      </StepExplanation>
      <Divider />
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/custom-levels-tab.png"
      />
      <Divider />

      On the right you should see playlists
      <Divider />
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/playlists-compact.png"
      />
      <Divider />

      You can expand playlist list by hovering over it
      <br />
      <StepExplanation>
        You might have to scroll down depending on how many playlists do you
        have
      </StepExplanation>
      <Divider />
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/playlists-expanded.png"
      />
      <Divider />
      <StepLink
        to={links.home.playlistInstallGuide
          .pcvrSteamManualPostInstallationCongratulations}
        children="I can see playlists, yay!"
      />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteamManualInstallMods}
        children="I can't see playlists, help"
      />
    </Step>
  );
};

export const PlaylistInstallGuidePCVRSteamManualInstallMods = () => {
  return (
    <Step>
      Close the game<br />
      If you did everything correctly, but you can't see playlist in game most
      likely you are missing <i>PlaylistManger</i> mod.
      <Divider />
      You can get it via
      <StepInlineATag
        target="_blank"
        href="https://github.com/Assistant/ModAssistant/releases/tag/v1.1.32"
      >
        ModAssistant
      </StepInlineATag>,
      <StepInlineATag target="_blank" href="https://beatmods.com/#/mods">
        BeatMods
      </StepInlineATag>,
      <StepInlineATag
        target="_blank"
        href="https://github.com/rithik-b/PlaylistManager#download"
      >
        Playlist Manager GitHub
      </StepInlineATag>
      <Divider />
      You should see playlists after the installation
      <Divider />
      <StepLink
        to={links.home.playlistInstallGuide
          .pcvrSteamManualPostInstallationCheck}
        children="Show me how to check it again"
      />
    </Step>
  );
};

export const PlaylistInstallGuidePCVRSteamCustom = () => {
  return (
    <Step>
      Get the archive:
      <StepInlineATag
        download
        href={latestPlaylistReleaseUrl}
        children="Download playlist archive"
      />
      <Divider />

      Extract contents of the archive and use your prefered method.<br />
      You should have <i>Playlists</i> folder with <i>ToT</i> and{" "}
      <i>ToT Guest</i> which contain a lot of <i>.bplist</i> files.
      <br />
      <StepExplanation>
        I would like to know what community uses to install this project, feel
        invited to contact me via Matrix or Discord so I can include a new
        installation method
      </StepExplanation>
      <Divider />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteam}
        children="Take me back"
      />
    </Step>
  );
};

export const PlaylistInstallGuidePCVRSteam = () => {
  return (
    <Step>
      Pick your preffered method
      <Divider />
      <StepLink
        to={links.home.playlistInstallGuide.modAssistant}
        children="I want to use ModAssistant's OneClick™"
      />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteamManualDownload}
        children="I pick the manual way"
      />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteamCustom}
        children="I want to use a tool, which is not described here"
      />
      <StepLink
        to={links.home.playlistInstallGuide.askAboutPlatform}
        children="Take me back"
      />
    </Step>
  );
};

export const PlaylistInstallGuidePlatform = () => {
  return (
    <Step>
      You play Beat Saber on...
      <Divider />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteam}
        children="PCVR Steam"
      />
      <StepLink
        to={""}
        className="opacity-50 hover:ring-transparent cursor-default"
        children="PCVR Meta store"
      />
      <StepLink
        to={""}
        className="opacity-50 hover:ring-transparent cursor-default"
        children="Standalone (you don't have the headset plugged into the PC)"
      />
      <a
        className="hover:ring-1 ring-white border min-w-0 inline-block px-4 py-1 box-content h-8 ml-2 mb-2"
        href="https://store.steampowered.com/valveindex"
      >
        PlayStation VR
      </a>
    </Step>
  );
};
