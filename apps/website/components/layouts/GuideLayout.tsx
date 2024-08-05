import { FC, ForwardRefExoticComponent, RefAttributes, Suspense, useRef } from "react";
import { VisualNovelContainerLoading } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { Link as _Link, LinkProps } from "react-router-dom";
import { links } from "@/apps/website/routing.config.ts";
import { Heading, Link } from "@/apps/website/components/layouts/MainLayout.tsx";
import { LayoutContent, LayoutSidebar, LayoutWrapper } from "@/apps/website/components/layouts/Layout.tsx";
import { Profile } from "@/apps/website/components/Profile.tsx";

const GuideLink: FC<LinkProps> = ({ children, ...props }) => {
  return (
    <Link {...props} className="text-lg py-0">
      {children}
    </Link>
  );
};

export const Guide: FC = () => {
  return (
    <>
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
    </>
  );
};

export const GuideLayout = (
  { children, style }: React.PropsWithChildren & {
    style?: React.CSSProperties;
  },
) => {
  return (
    <LayoutWrapper>
      <LayoutSidebar>
        <Heading />
        <hr className="my-4 mx-2 border-blue-200" />
        <Guide />
        <Profile />
      </LayoutSidebar>
      <LayoutContent style={style}>
        {children}
      </LayoutContent>
    </LayoutWrapper>
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
