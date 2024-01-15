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
// https://danielduel-tot-bot.deno.dev/api/playlist/guild/689050370840068309/channel/1176658722563567759

const Divider = () => <div className="h-6 block" />;

const getInstallSteps = (setStep: (s: keyof InstallStepsT) => void) => ({
  installation_steam_modassistant: (
    <>
      ModAssistant is by far the easiest way to install
    </>
  ),
  installation_steam_manual_folder: (
    <>
      First, you will need the archive:
      <a
        download
        className="border px-4 py-1 box-content h-8 ml-2"
        href="https://github.com/Danielduel/tower-of-tech/releases/download/0.0.9/ToT.zip"
      >
        Get the playlist archive
      </a>

      Move the archive to Beat Saber's folder.<br />
      Go to Beat Saber's folder (or go to Steam, right click Beat Saber, Manage,
      Browse local files). Place downloaded <i>ToT.zip</i>{" "}
      in the main Beat Saber folder:<br />
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/tot-in-folder.png"
      />
      Right click it, extract here. You should have <i>Playlist</i> folder with
      {" "}
      <i>ToT</i> and <i>ToT Guest</i> which contain a lot of <i>.bplist</i>{" "}
      files. You can open Beat Saber and check if your Playlists are in the
      game.
      <br />
      <br />
      Run the game, pick the community tab in solo mode (this hand with a
      musical note icon):
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/custom-levels-tab.png"
      />
      And on the right you should see playlists:
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/playlists-compact.png"
      />
      If you hover over the list on the right - ToT playlists should look like
      so (I use a lot of playlists and I had to scroll):
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/playlists-expanded.png"
      />
      <div className="h-6 block" />
      <button
        className="border block px-4 py-1 box-content h-8 ml-2 mb-2"
        onClick={() => setStep("installation_steam_mods")}
      >
        I can see playlists, yay!
      </button>
      <button
        className="border px-4 py-1 box-content h-8 ml-2 mb-2"
        onClick={() => setStep("installation_steam_mods")}
      >
        I can't see playlists
      </button>
    </>
  ),
  installation_steam_manual_extract: <></>,
  installation_oculus: <></>,
  installation_oculus_standalone: <></>,
  installation_steam_mods: <></>,
});

const Step: FC<PropsWithChildren & { firstStep?: boolean }> = (
  { children, firstStep },
) => {
  return (
    <VisualNovelContainer>
      <VisualNovelBody>
        {children}
      </VisualNovelBody>
      <VisualNovelActions>
        {!firstStep && (
          <VisualNovelLink
            href={links.home.playlistInstallGuide.root}
            children="Go to beginning"
          />
        )}
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
      href={`bsplaylist://playlist/${href}`}
      onClick={() => setVisited(true)}
    >
      {name}
    </a>
  );
};

export const PlaylistInstallGuideModAssistant = () => {
  const playlistArray = useMemo(() => Object.values(playlistMapping), []);
  return (
    <Step firstStep>
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

export const PlaylistInstallGuidePCVRSteam = () => {
  return (
    <Step firstStep>
      There are few easy options to make playlists appear in the game. If you
      have a tool or manager that you prefer - feel free to use it, extract
      contents of the archive and use your prefered method.
      <br />
      <small>
        Feel free to dm me on Discord or Matrix if you would like me to describe
        your method here
      </small>
      <Divider />
      <StepLink
        to={links.home.playlistInstallGuide.modAssistant}
        children="I want to use ModAssistant's OneClick™"
      />
      <StepLink
        to={""}
        children="I pick the manual way"
      />
      <StepLink
        to={""}
        children="Take me back"
      />
    </Step>
  );
};

export const PlaylistInstallGuidePlatform = () => {
  return (
    <Step firstStep>
      You play Beat Saber on:
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
