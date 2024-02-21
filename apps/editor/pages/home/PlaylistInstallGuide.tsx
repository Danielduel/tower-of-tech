import { FC, forwardRef, useMemo, useState } from "react";
import { links } from "@/apps/editor/routing.config.ts";
import { Image } from "@/apps/editor/components/Image.tsx";
import {
  getPlaylistUrlFromPlaylistId,
  playlistMapping,
} from "@/packages/playlist-mapping/mod.ts";
import { latestPlaylistReleaseUrl } from "@/packages/utils/constants.ts";
import {
  VisualNovelDivider,
  VisualNovelOneClickAnchor,
  VisualNovelStep,
  VisualNovelStepExplanation,
  VisualNovelStepInlineATag,
  VisualNovelStepLink,
} from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { ToTPlaylistMappingItem } from "@/packages/playlist-mapping/mod.ts";
import { ToTPlaylistMappingItemSpeed } from "@/packages/playlist-mapping/mod.ts";
import { ToTPlaylistMappingItemTech } from "@/packages/playlist-mapping/mod.ts";
import { trpc } from "@/packages/trpc/trpc-react.ts";
import { VisualNovelButton } from "@/apps/editor/components/containers/VisualNovelBox.tsx";

const getToTPlaylistSpeedCategory = (
  speedCategory: ToTPlaylistMappingItemSpeed,
) => {
  switch (speedCategory) {
    case "Adep":
      return "Slower";
    case "Acc":
      return "Average";
    case "Mid":
      return "Faster";
    case "Fas":
      return "Very fast";
    case "Sonic":
      return "Insane";
  }
};

const getToTPlaylistTechCategory = (
  speedCategory: ToTPlaylistMappingItemTech,
) => {
  switch (speedCategory) {
    case "Comfy":
      return "Easy";
    case "Tech":
      return "Normal";
    case "Hitech":
      return "Hard";
    case "Anglehell":
      return "Expert";
    case "Tempo":
      return "Insane";
  }
};

export const ToTPlaylistItem: FC<ToTPlaylistMappingItem> = ({
  displayName,
  playlistId,
  speedCategory,
  techCategory,
}) => {
  const { data } = trpc.playlist.getById.useQuery({ id: playlistId });

  return (
    <div className="flex">
      <div>
        <Image
          className="w-40 h-40 mr-3"
          height={160}
          width={160}
          src={data?.imageUrl}
        />
      </div>
      <div className="py-2 flex flex-col w-64">
        <div className="text-2xl">
          {displayName}
        </div>
        <div className="text-xl">
          Speed: {getToTPlaylistSpeedCategory(speedCategory)}
        </div>
        <div className="text-xl">
          Complexity: {getToTPlaylistTechCategory(techCategory)}
        </div>
        <div className="text-xl">
          Items: {data?.songs.length}
        </div>
        <div className="text-xl ml-auto mt-auto">
          <VisualNovelStepLink to={links.home.playlist.details(data?.id)}>
            Browse
          </VisualNovelStepLink>
        </div>
      </div>
    </div>
  );
};

export const ToTPlaylistList = () => {
  const playlistArray = useMemo(() => Object.values(playlistMapping), []);
  return (
    <div>
      {playlistArray.map((x) => (
        <VisualNovelOneClickAnchor
          href={getPlaylistUrlFromPlaylistId(x.playlistId)}
        >
          <ToTPlaylistItem {...x} />
        </VisualNovelOneClickAnchor>
      ))}
    </div>
  );
};

export const PlaylistInstallGuideModAssistant = forwardRef<HTMLDivElement>(
  (_, ref) => {
    return (
      <VisualNovelStep ref={ref}>
        Click on playlist names underneath to trigger the ModAssistant's
        installation
        <VisualNovelStepExplanation>
          The downside of this method is that you will have all of those
          playlist in the main playlist folder which could make it hard to
          navigate when you have many playlists already
        </VisualNovelStepExplanation>
        <VisualNovelStepExplanation>
          This method sometimes causes ModAssistant to fail parsing the
          playlist. If it is a case for you, I suggest picking other
          installation method
        </VisualNovelStepExplanation>
        <VisualNovelDivider />
        <ToTPlaylistList />
        <VisualNovelDivider />
        <VisualNovelStepLink
          to={links.home.playlistInstallGuide.pcvrSteam}
          children="Take me back"
        />
      </VisualNovelStep>
    );
  },
);

export const PlaylistInstallGuidePCVRSteamManualDownload = forwardRef<
  HTMLDivElement
>((_, ref) => {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <VisualNovelStep ref={ref}>
      First, you will need the archive:
      <VisualNovelStepInlineATag
        download
        onClick={() => setDownloaded(true)}
        className="border px-4 py-1 box-content h-8 ml-4"
        href={latestPlaylistReleaseUrl}
      >
        Download playlist archive
      </VisualNovelStepInlineATag>
      <VisualNovelDivider />
      <VisualNovelStepLink
        to={links.home.playlistInstallGuide.pcvrSteamManualLocateFolder}
        children={downloaded ? "Got it!" : "I already have this"}
      />
      <VisualNovelStepLink
        to={links.home.playlistInstallGuide.pcvrSteam}
        children="Take me back"
      />
    </VisualNovelStep>
  );
});

export const PlaylistInstallGuidePCVRSteamManualLocateFolder = forwardRef<
  HTMLDivElement
>((_, ref) => {
  return (
    <VisualNovelStep ref={ref}>
      Go to Beat Saber's folder
      <VisualNovelStepExplanation>
        Open <i>Steam</i>, select <i>Library</i>, right click <i>Beat Saber</i>
        {" "}
        in the library list, select <i>Manage</i> in the dropdown, click{" "}
        <i>Browse local files</i> option
      </VisualNovelStepExplanation>
      <VisualNovelDivider />
      <VisualNovelStepLink
        to={links.home.playlistInstallGuide.pcvrSteamManualMoveAndExtract}
        children="Done!"
      />
      <VisualNovelStepLink
        to={links.home.playlistInstallGuide.pcvrSteamManualDownload}
        children="Take me back"
      />
    </VisualNovelStep>
  );
});

export const PlaylistInstallGuidePCVRSteamManualMoveAndExtract = forwardRef<
  HTMLDivElement
>((_, ref) => {
  return (
    <VisualNovelStep ref={ref}>
      Move the downloaded <i>ToT.zip</i>{" "}
      to the main Beat Saber folder and extract it<br />
      <VisualNovelStepExplanation>
        Move <i>ToT.zip</i> archive from <i>Downloads</i> to your{" "}
        <i>Beat Saber folder</i>. Right click the ToT.zip, depending on your
        system you should have an option to{" "}
        <i>
          extract the archive here
        </i>.
      </VisualNovelStepExplanation>
      <Image
        className="rounded-xl mx-auto"
        src="/playlist-installation-guide/tot-in-folder.png"
        width={391}
        height={339}
      />
      <VisualNovelDivider />
      <VisualNovelStepLink
        to={links.home.playlistInstallGuide
          .pcvrSteamManualPostInstallationCheck}
        children="Done, how to check if it works?"
      />
      <VisualNovelStepLink
        to={links.home.playlistInstallGuide.pcvrSteamManualLocateFolder}
        children="Take me back"
      />
    </VisualNovelStep>
  );
});

export const PlaylistInstallGuidePCVRPostInstallationCongratulations =
  forwardRef<HTMLDivElement>((_, ref) => {
    return (
      <VisualNovelStep ref={ref}>
        Congratulations!
        <VisualNovelDivider />
        Those playlists are contantly growing, there are 2 kinds of updates
        <VisualNovelDivider />
        Release updates happening every month or two
        <VisualNovelStepExplanation>
          Those updates are modifying how playlists work and add/remove
          playlists and to use those updates - you have to reinstall playlists
        </VisualNovelStepExplanation>
        <VisualNovelDivider />
        Incremental updates happening few times a week
        <VisualNovelStepExplanation>
          Those updates are modifying the content of playlists and you can fetch
          those via in-game sync button
        </VisualNovelStepExplanation>
        <VisualNovelDivider />
        <VisualNovelStepLink
          to={"#"}
          className="opacity-50 hover:ring-transparent cursor-default"
          children="I have a lot of playlists now, how to manage this"
        />
        <VisualNovelStepLink
          to={"#"}
          className="opacity-50 hover:ring-transparent cursor-default"
          children="Tell me which playlist does what"
        />
      </VisualNovelStep>
    );
  });

export const PlaylistInstallGuidePCVRSteamManualPostInstallationCheck =
  forwardRef<HTMLDivElement>((_, ref) => {
    return (
      <VisualNovelStep ref={ref}>
        Run the game
        <br />
        <VisualNovelStepExplanation>
          Optional<br />
          If you don't want to start VR - you can add "fpfc" to launch flags to
          Beat Saber in steam so you don't have to get into VR (remember to
          remove it afterwards)
        </VisualNovelStepExplanation>
        <VisualNovelDivider />

        Pick the community tab in solo mode
        <br />
        <VisualNovelStepExplanation>
          Second from the left - it is this hand with a musical note icon
        </VisualNovelStepExplanation>
        <VisualNovelDivider />
        <Image
          className="rounded-xl mx-auto"
          src="/playlist-installation-guide/custom-levels-tab.png"
          width={269}
          height={182}
        />
        <VisualNovelDivider />

        On the right you should see playlists
        <VisualNovelDivider />
        <Image
          className="rounded-xl mx-auto"
          src="/playlist-installation-guide/playlists-compact.png"
          width={712}
          height={179}
        />
        <VisualNovelDivider />

        You can expand playlist list by hovering over it
        <br />
        <VisualNovelStepExplanation>
          You might have to scroll down depending on how many playlists do you
          have
        </VisualNovelStepExplanation>
        <VisualNovelDivider />
        <Image
          className="rounded-xl mx-auto"
          src="/playlist-installation-guide/playlists-expanded.png"
          width={584}
          height={339}
        />
        <VisualNovelDivider />
        <VisualNovelStepLink
          to={links.home.playlistInstallGuide
            .pcvrSteamManualPostInstallationCongratulations}
          children="I can see playlists, yay!"
        />
        <VisualNovelStepLink
          to={links.home.playlistInstallGuide.pcvrSteamManualInstallMods}
          children="I can't see playlists, help"
        />
      </VisualNovelStep>
    );
  });

export const PlaylistInstallGuidePCVRSteamManualInstallMods = forwardRef<
  HTMLDivElement
>((_, ref) => {
  return (
    <VisualNovelStep ref={ref}>
      Close the game<br />
      If you did everything correctly, but you can't see playlist in game most
      likely you are missing <i>PlaylistManger</i> mod.
      <VisualNovelDivider />
      You can get it via
      <VisualNovelStepInlineATag
        target="_blank"
        href="https://github.com/Assistant/ModAssistant/releases/tag/v1.1.32"
      >
        ModAssistant
      </VisualNovelStepInlineATag>,
      <VisualNovelStepInlineATag
        target="_blank"
        href="https://beatmods.com/#/mods"
      >
        BeatMods
      </VisualNovelStepInlineATag>,
      <VisualNovelStepInlineATag
        target="_blank"
        href="https://github.com/rithik-b/PlaylistManager#download"
      >
        Playlist Manager GitHub
      </VisualNovelStepInlineATag>
      <VisualNovelDivider />
      You should see playlists after the installation
      <VisualNovelDivider />
      <VisualNovelStepLink
        to={links.home.playlistInstallGuide
          .pcvrSteamManualPostInstallationCheck}
        children="Show me how to check it again"
      />
    </VisualNovelStep>
  );
});

export const PlaylistInstallGuidePCVRSteamCustom = forwardRef<HTMLDivElement>(
  (_, ref) => {
    return (
      <VisualNovelStep ref={ref}>
        Get the archive:
        <VisualNovelStepInlineATag
          download
          href={latestPlaylistReleaseUrl}
          children="Download playlist archive"
        />
        <VisualNovelDivider />

        Extract contents of the archive and use your preferred method.<br />
        You should have <i>Playlists</i> folder with <i>ToT</i> and{" "}
        <i>ToT Guest</i> which contain a lot of <i>.bplist</i> files.
        <br />
        <VisualNovelStepExplanation>
          I would like to know what community uses to install this project, feel
          invited to contact me via Matrix or Discord so I can include a new
          installation method
        </VisualNovelStepExplanation>
        <VisualNovelDivider />
        <VisualNovelStepLink
          to={links.home.playlistInstallGuide.pcvrSteam}
          children="Take me back"
        />
      </VisualNovelStep>
    );
  },
);

export const PlaylistInstallGuidePCVRSteam = forwardRef<HTMLDivElement>(
  (_, ref) => {
    return (
      <VisualNovelStep ref={ref}>
        Pick your preferred method
        <VisualNovelDivider />
        <VisualNovelStepLink
          to={links.home.playlistInstallGuide.modAssistant}
          children="I want to use ModAssistant's OneClick™"
        />
        <VisualNovelStepLink
          to={links.home.playlistInstallGuide.pcvrSteamManualDownload}
          children="I pick the manual way"
        />
        <VisualNovelStepLink
          to={links.home.playlistInstallGuide.pcvrSteamCustom}
          children="I want to use a tool, which is not described here"
        />
        <VisualNovelStepLink
          to={links.home.playlistInstallGuide.askAboutPlatform}
          children="Take me back"
        />
      </VisualNovelStep>
    );
  },
);

export const PlaylistInstallGuidePlatform = forwardRef<HTMLDivElement>(
  (_, ref) => {
    return (
      <VisualNovelStep ref={ref}>
        You play Beat Saber on...
        <VisualNovelDivider />
        <VisualNovelStepLink
          to={links.home.playlistInstallGuide.pcvrSteam}
          children="PCVR Steam"
        />
        <VisualNovelStepLink
          to={""}
          className="opacity-50 hover:ring-transparent cursor-default"
          children="PCVR Meta store"
        />
        <VisualNovelStepLink
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
      </VisualNovelStep>
    );
  },
);
