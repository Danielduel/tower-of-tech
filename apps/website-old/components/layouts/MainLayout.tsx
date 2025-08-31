import { FC, ForwardRefExoticComponent, RefAttributes, Suspense, useRef } from "react";
import { VisualNovelContainerLoading } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { Link as _Link, LinkProps } from "react-router-dom";
import { links } from "@/apps/website-old/routing.config.ts";
import { useResolvedPath } from "react-router-dom";
import { useMatch } from "react-router-dom";
import { cn } from "@/packages/deps/classnames.ts";
import { LayoutContent, LayoutSidebar, LayoutWrapper } from "@/apps/website-old/components/layouts/Layout.tsx";

export const Link: FC<LinkProps> = (props) => {
  const resolved = useResolvedPath(props.to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <_Link
      {...props}
      className={cn(
        "select-none px-4 p-1 hover:ring-1 hover:text-white ring-gray-200 hover:ring-white w-full block",
        {
          "border-l-4": match,
        },
        props.className,
      )}
    />
  );
};

export const HeadingLink: FC<LinkProps> = ({ children, ...props }) => {
  return (
    <Link {...props}>
      {children}
    </Link>
  );
};

export const HeadingMinimal: FC = () => {
  return (
    <>
      <HeadingLink to={links.home.root}>Home</HeadingLink>
    </>
  );
};

export const Heading: FC = () => {
  return (
    <>
      <HeadingMinimal />
      <HeadingLink to={links.home.browse}>Browse</HeadingLink>
      <HeadingLink to={links.home.playlistInstallGuide.root}>Guide</HeadingLink>
    </>
  );
};

export const MainLayout = (
  { children, style }: React.PropsWithChildren & {
    style?: React.CSSProperties;
  },
) => {
  return (
    <LayoutWrapper>
      <LayoutSidebar>
        <Heading />
      </LayoutSidebar>
      <LayoutContent style={style}>
        {children}
      </LayoutContent>
    </LayoutWrapper>
  );
};

export const MainLayoutShell: FC<
  { Component: ForwardRefExoticComponent<RefAttributes<HTMLDivElement>> }
> = (
  { Component },
) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="main-gradient">
      <MainLayout>
        <Suspense
          fallback={<VisualNovelContainerLoading ref={nodeRef} />}
        >
          <Component ref={nodeRef} />
        </Suspense>
      </MainLayout>
    </div>
  );
};
