import { FC, ForwardRefExoticComponent, RefAttributes, Suspense, useRef } from "react";
import { VisualNovelContainerLoading } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { Link as _Link, LinkProps } from "react-router-dom";
import { links } from "@/apps/website/routing.config.ts";
import { HeadingLink, Link } from "@/apps/website/components/layouts/MainLayout.tsx";

const GuideLink: FC<LinkProps> = ({ children, ...props }) => {
  return (
    <Link {...props} className="text-lg py-0">
      {children}
    </Link>
  );
};

export const Guide: FC = () => {
  return (
    <div className="hidden md:block w-56 h-[100dvh] text-2xl pt-4 text-left bg-transparent sticky top-0">
      <div className="w-full h-full mx-auto text-white">
        <HeadingLink to={links.home.root}>Home</HeadingLink>
        <HeadingLink to={links.home.browse}>Browse</HeadingLink>
        <HeadingLink to={links.home.playlistInstallGuide.root}>Guide</HeadingLink>
        <hr className="my-4" />
        <GuideLink to={links.home.playlistInstallGuide.askAboutPlatform} children="Begin" />
        <GuideLink to={links.home.playlistInstallGuide.pcvrSteam} children="PCVR Steam" />
        <GuideLink to={links.home.playlistInstallGuide.modAssistant} children="Mod assistant" />
        <GuideLink to={links.home.playlistInstallGuide.pcvrSteamCustom} children="Steam custom" />
        <GuideLink to={links.home.playlistInstallGuide.pcvrSteamManualDownload} children="Steam manual" />
        <GuideLink to={links.home.playlistInstallGuide.pcvrSteamManualInstallMods} children="Install mods" />
        <GuideLink to={links.home.playlistInstallGuide.pcvrSteamManualLocateFolder} children="Locate folder" />
        <GuideLink to={links.home.playlistInstallGuide.pcvrSteamManualMoveAndExtract} children="Move and extract" />
        <GuideLink
          to={links.home.playlistInstallGuide.pcvrSteamManualPostInstallationCheck}
          children="Post install check"
        />
        <GuideLink
          to={links.home.playlistInstallGuide.pcvrSteamManualPostInstallationCongratulations}
          children="Finish"
        />
      </div>
    </div>
  );
};

const GuideSidebar = () => {
  return (
    <div className="min-h-[100dvh] max-w-[100dvw] overflow-hidden flex flex-col">
      <div className="flex flex-row">
        <Guide />
      </div>
    </div>
  );
};

export const GuideLayout = (
  { children, style }: React.PropsWithChildren & {
    style?: React.CSSProperties;
  },
) => {
  return (
    <div className="min-h-[100dvh] max-w-[100dvw] overflow-hidden w-max mx-auto flex flex-col">
      <div className="flex flex-row">
        <GuideSidebar />
        <div
          style={style}
          className="z-10 my-10 text-white page min-w-[85ch] max-w-[85ch]"
        >
          <div className="container md:mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const GuideLayoutShell: FC<
  { Component: ForwardRefExoticComponent<RefAttributes<HTMLDivElement>> }
> = (
  { Component },
) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="main-gradient">
      <GuideLayout>
        <Suspense
          fallback={<VisualNovelContainerLoading ref={nodeRef} />}
        >
          <Component ref={nodeRef} />
        </Suspense>
      </GuideLayout>
    </div>
  );
};
