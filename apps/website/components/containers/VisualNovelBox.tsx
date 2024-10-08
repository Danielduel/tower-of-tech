import { AnchorHTMLAttributes, FC, forwardRef, HTMLAttributes, PropsWithChildren, useState } from "react";
import { LinkProps, useLocation } from "react-router-dom";
import { Link } from "@/apps/website/components/ui/Link.tsx";
import { links } from "@/apps/website/routing.config.ts";
import { cn } from "@/packages/deps/classnames.ts";
import { LayoutContent, LayoutWrapper } from "@/apps/website/components/layouts/Layout.tsx";

export const VisualNovelLink = (props: LinkProps) => {
  return (
    <div className="border-r-4 border-white mt-5 h-8">
      <Link to="#" {...props} className="p-4 !text-2xl" />
    </div>
  );
};

export const VisualNovelButton = (
  props: HTMLAttributes<HTMLDivElement>,
) => {
  return (
    <div className="border-r-4 border-white mt-5 h-8">
      <div
        {...props}
        className="cursor-pointer select-none box-border inline hover:ring-1 hover:text-white ring-white p-4 text-2xl"
      />
    </div>
  );
};

export const VisualNovelButtonMedium = (
  props: HTMLAttributes<HTMLDivElement>,
) => {
  return (
    <div className="border-r-4 border-white mt-2 h-5">
      <div
        {...props}
        className="cursor-pointer select-none box-border inline hover:ring-1 hover:text-white ring-white p-2"
      />
    </div>
  );
};

export const VisualNovelAnchor = (
  props: AnchorHTMLAttributes<HTMLAnchorElement>,
) => {
  return (
    <div className="border-r-4 border-white mt-5 h-8">
      <a
        {...props}
        className={cn("select-none hover:ring-1 hover:text-white ring-white w-full p-4 text-2xl", props.className)}
      />
    </div>
  );
};

export const VisualNovelActions: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full text-right text-2xl text-slate-200 flex flex-col gap-4 mt-4 mb-10">
      {children}
    </div>
  );
};

export const VisualNovelBody: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="box-border text-2xl text-slate-200 w-full p-4 md:p-6 text-left md:glass">
      <div key="content">
        {children}
      </div>
    </div>
  );
};

export const VisualNovelSubBody: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="box-border text-2xl text-slate-200 w-full p-4 pt-2 md:p-6 md:pt-3 text-left">
      <div key="content">
        {children}
      </div>
    </div>
  );
};

export const VisualNovelContainer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    imageUrl?: string;
    row?: boolean;
    header?: PropsWithChildren["children"];
  }>
>(({ children, imageUrl, row, header }, ref) => {
  return (
    <LayoutContent ref={ref}>
      {children}
    </LayoutContent>
  );
  // return (
  //   <div>
  //     <div
  //       className={cn(
  //         "w-[100dvw] min-h-[100dvh] pt-4 text-white text-5xl md:w-full md:flex overflow-hidden box-border",
  //         {
  //           "flex-row items-start": row,
  //           "flex-col items-center": !row,
  //         },
  //       )}
  //       ref={ref}
  //     >
  //       {children}
  //     </div>
  //   </div>
  // );
});

export const VisualNovelContainerLoading = forwardRef<HTMLDivElement>(
  (p, ref) => {
    return (
      <LayoutWrapper>
        <VisualNovelContainer ref={ref}>
          Loading...
        </VisualNovelContainer>
      </LayoutWrapper>
    );
  },
);

export const VisualNovelDivider = () => <div className="h-6 block" />;

export const VisualNovelStep = forwardRef<
  HTMLDivElement,
  PropsWithChildren
>((
  { children },
  ref,
) => {
  const { pathname } = useLocation();

  const isOutsideOfPlaylistTutorial = !pathname.startsWith(
    links.home.playlistInstallGuide.root,
  ) && !pathname.startsWith(
    links.home.playlistManagementGuide.root,
  );

  return (
    <VisualNovelContainer ref={ref}>
      <VisualNovelBody>
        {children}
      </VisualNovelBody>
      <VisualNovelActions>
        {isOutsideOfPlaylistTutorial &&
          (
            <VisualNovelLink
              to={links.home.playlistInstallGuide.root}
              children="I want those playlists"
            />
          )}
        <VisualNovelLink to={links.home.root} children="Return to start" />
      </VisualNovelActions>
    </VisualNovelContainer>
  );
});

export const VisualNovelStepExplanation: FC<
  PropsWithChildren & { className?: string }
> = (
  { children, className = "" },
) => {
  return (
    <div className={`text-lg border-l-2 text-cyan-50 pl-5 mt-2 ${className}`}>
      {children}
    </div>
  );
};

export const VisualNovelStepInlineATag: FC<
  AnchorHTMLAttributes<HTMLAnchorElement>
> = (
  props,
) => {
  return (
    <a
      className="border px-4 py-1 box-content h-8 ml-4 mr-1 hover:ring-1 inline-block hover:text-white ring-white w-max min-w-0 mb-2 !text-2xl no-underline"
      {...props}
    />
  );
};

export const VisualNovelStepLink: FC<LinkProps> = (props) => {
  return (
    <Link
      {...props}
      className={`border block w-max min-w-0 px-4 py-1 box-content ml-2 mb-2 !text-2xl no-underline ${props.className}`}
    />
  );
};

export const VisualNovelATag: FC<
  PropsWithChildren & { href: string; download: boolean }
> = (
  { href, children, download },
) => {
  const [visited, setVisited] = useState(false);
  return (
    <a
      className={"hover:ring-1 hover:text-white ring-white border block w-max min-w-0 px-4 py-1 box-content ml-2 mb-2 !text-2xl no-underline " +
        (visited ? "opacity-50" : "")}
      href={href}
      target="_blank"
      download={download}
      onClick={() => setVisited(true)}
    >
      {children}
    </a>
  );
};

export const VisualNovelOneClickAnchor: FC<
  PropsWithChildren & { href: string }
> = (
  { href, children },
) => {
  const [visited, setVisited] = useState(false);
  return (
    <a
      className={"hover:ring-1 hover:text-white ring-white border block w-max min-w-0 px-4 py-1 box-content ml-2 mb-2 !text-2xl no-underline " +
        (visited ? "opacity-50" : "")}
      href={href}
      onClick={() => setVisited(true)}
    >
      {children}
    </a>
  );
};
