import { FC, ForwardRefExoticComponent, RefAttributes, Suspense, useRef } from "react";
import { VisualNovelContainerLoading } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { Link as _Link, LinkProps } from "react-router-dom";
import { links } from "@/apps/website/routing.config.ts";
import { useResolvedPath } from "react-router-dom";
import { useMatch } from "react-router-dom";
import { cn } from "@/packages/utils/classnames.ts";

export const Link: FC<LinkProps> = (props) => {
  const resolved = useResolvedPath(props.to);
  const match = useMatch({ path: resolved.pathname, end: true });

  return (
    <_Link
      {...props}
      className={cn(
        "select-none px-4 p-1 hover:ring-1 hover:text-white ring-white w-full block",
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

export const Heading: FC = () => {
  return (
    <div className="hidden md:block w-56 h-[100dvh] text-2xl pt-4 text-left bg-transparent sticky top-0">
      <div className="w-full h-full mx-auto text-white">
        <HeadingLink to={links.home.root}>Home</HeadingLink>
        <HeadingLink to={links.home.browse}>Browse</HeadingLink>
        <HeadingLink to={links.home.playlistInstallGuide.root}>Guide</HeadingLink>
      </div>
    </div>
  );
};

export const MainLayout = (
  { children, style }: React.PropsWithChildren & {
    style?: React.CSSProperties;
  },
) => {
  return (
    <div className="">
      <div className="min-h-[100dvh] max-w-[100dvw] w-max overflow-hidden flex flex-row mx-auto">
        <Heading />
        <div
          style={style}
          className="z-10 my-10 min-w-min text-white page"
        >
          <div className="container md:mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
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
