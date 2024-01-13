import {
  VisualNovelActions,
  VisualNovelAnchor,
  VisualNovelBody,
  VisualNovelButton,
  VisualNovelContainer,
  VisualNovelLink,
} from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { links } from "@/apps/editor/routing.config.ts";
import { satisfies } from "https://deno.land/std@0.176.0/semver/mod.ts";
import { useCallback, useMemo, useState } from "react";

type InstallStepsT = {
  downloading: boolean;
  installation_steam: boolean;
  installation_steam_mods: boolean;
  installation_oculus: boolean;
  installation_oculus_standalone: boolean;
}

const getInstallSteps = (setStep: (s: keyof InstallStepsT) => void) => ({
  downloading: <>
    First, you will need the archive: 
    <a
      download
      className="border px-4 py-1 box-content h-8 ml-2"
      href="https://github.com/Danielduel/tower-of-tech/releases/download/0.0.9/ToT.zip"
    >
      Get the playlist archive
    </a>
    <br />
    <br />
    Got it? Great! Now you have to tell me what do you play Beat Saber on.<br />
    You play Beat Saber on:
    <br />
    <button
      className="border px-4 py-1 box-content h-8 ml-2 mb-2"
      onClick={() => setStep("installation_steam")}
    >
      PCVR Steam
    </button><br />
    <button
      className="border px-4 py-1 box-content h-8 ml-2 mb-2"
      onClick={() => setStep("installation_steam")}
    >
      Standalone (you have the headset not plugged in to PC)
    </button><br />
    <button
      className="border px-4 py-1 box-content h-8 ml-2 mb-3"
      onClick={() => setStep("installation_steam")}
    >
      Other PCVR than Steam
    </button><br />
    <a
      className="border px-4 py-1 box-content h-8 ml-2 mb-2"
      href="https://store.steampowered.com/valveindex">
      PlayStation VR
    </a>
  </>,
  installation_steam: <>
    There are few easy options how to make playlists appear in the game, but I will cover the one which doesn't require other tools.
    <br />
    <br />
    Playlists require a mod to work, but in most cases you already have it or other mod that
    do exactly the same thing, so go back here if something doesn't work.
    <button
      className="border px-4 py-1 box-content h-8 ml-2 mb-2"
      onClick={() => setStep("installation_steam")}
    >
      Mod installation
    </button>
    <br />
    <br />
    Go to Beat Saber's folder (or go to Steam, right click Beat Saber, Manage, Browse local files)<br />
    Place downloaded <i>ToT.zip</i> in the main Beat Saber folder:<br />
    <img className="rounded-xl mx-auto" src="/playlist_installation_guide/tot-in-folder.png" />
    Right click it, extract here. You should have <i>Playlist</i> folder with <i>ToT</i> and <i>ToT Guest</i> which contain a lot of <i>.bplist</i> files.
    You can open Beat Saber and check if your Playlists are in the game.
  </>,
  installation_oculus: <></>,
  installation_oculus_standalone: <></>,
  installation_steam_mods: <></>,
} satisfies Record<keyof InstallStepsT, unknown>);

export function PlaylistInstallGuide() {
  const [step, setStep] = useState<keyof InstallStepsT>("downloading");
  const installSteps = useMemo(() => getInstallSteps(setStep), [ setStep ]);
  const installationPrompt = installSteps[step];

  return (
    <VisualNovelContainer>
      <VisualNovelBody>
        {installationPrompt}
      </VisualNovelBody>
      <VisualNovelActions>
        {step != "downloading" && (
          <VisualNovelButton
            onClick={() => {
              setStep("downloading");
            }}
            children="Go to beginning"
          />
        )}
        <VisualNovelLink to={links.home.more} children="Tell me more" />
        <VisualNovelLink to={links.home.root} children="Go back" />
      </VisualNovelActions>
    </VisualNovelContainer>
  );
}
