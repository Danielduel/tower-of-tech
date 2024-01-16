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
    </Step>
  );
};

export const PlaylistInstallGuidePCVRSteamManualDownload = () => {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <Step>
      First, you will need the archive:
      <a
        download
        onClick={() => setDownloaded(true)}
        className="border px-4 py-1 box-content h-8 ml-4"
        href="https://github.com/Danielduel/tower-of-tech/releases/download/0.0.9/ToT.zip"
      >
        Download playlist archive
      </a>
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
      <br />
      <small>
        (or go to Steam, right click Beat Saber, Manage, Browse local files)
      </small>
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
      Move the archive to Beat Saber's folder.<br />
      Place downloaded <i>ToT.zip</i> in the main Beat Saber folder:<br />
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/tot-in-folder.png"
      />
      Right click it, extract here. You should have <i>Playlists</i> folder with
      {" "}
      <i>ToT</i> and <i>ToT Guest</i> which contain a lot of <i>.bplist</i>{" "}
      files. You can open Beat Saber and check if your Playlists are in the
      game.
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

export const PlaylistInstallGuidePCVRSteamManualPostInstallationCheck = () => {
  return (
    <Step>
      Run the game
      <br />
      <small>
        (if you don't want to start VR - you can add "fpfc" to launch flags to
        Beat Saber in steam so you don't have to get into VR)
      </small>
      <Divider />

      Pick the community tab in solo mode
      <br />
      <small>
        (this hand with a musical note icon)
      </small>
      <Divider />
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/custom-levels-tab.png"
      />
      <Divider />

      On the right you should see playlists
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/playlists-compact.png"
      />
      <Divider />

      You can expand playlist list by hovering over it
      <br />
      <small>
        (depending on how many playlists do you have - you might need to scroll
        down)
      </small>
      <Divider />
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/playlists-expanded.png"
      />
      <Divider />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteamManualMoveAndExtract}
        children="I can see playlists, yay!"
      />
      <StepLink
        to={links.home.playlistInstallGuide.pcvrSteamManualDownload}
        children="I can't see playlists, help"
      />
    </Step>
  );
};

export const PlaylistInstallGuidePCVRSteam = () => {
  return (
    <Step>
      There are few easy options to make playlists appear in the game. If you
      have a tool or manager that you prefer - use it, extract contents of the
      archive and use your prefered method.
      <br />
      <small>
        (feel free to dm me on Discord or Matrix if you would like me to
        describe your method here)
      </small>
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
      {
        /* <StepLink
        to={""}
        children="PCVR Meta store (Oculus store)"
      />
      <StepLink
        to={""}
        className="opacity-50 hover:ring-transparent cursor-default"
        children="Standalone (you don't have the headset plugged into the PC)"
      /> */
      }
      <a
        className="hover:ring-1 ring-white border min-w-0 inline-block px-4 py-1 box-content h-8 ml-2 mb-2"
        href="https://store.steampowered.com/valveindex"
      >
        PlayStation VR
      </a>
    </Step>
  );
};
