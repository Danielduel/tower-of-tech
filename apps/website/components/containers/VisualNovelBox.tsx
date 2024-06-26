import { forwardRef, PropsWithChildren, useState } from "react";
import { LinkProps } from "react-router-dom";
import { Link } from "@/packages/ui/Link.tsx";
import { AnchorHTMLAttributes, FC, HtmlHTMLAttributes } from "npm:@types/react";
import { links } from "@/apps/website/routing.config.ts";
import { Image } from "@/apps/website/components/Image.tsx";

export const VisualNovelLink = (props: LinkProps) => {
  return (
    <div className="border-r-4 border-white mt-5 h-8">
      <Link to="#" {...props} className="p-4 !text-2xl" />
    </div>
  );
};

export const VisualNovelButton = (
  props: HtmlHTMLAttributes<HTMLDivElement>,
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
  props: HtmlHTMLAttributes<HTMLDivElement>,
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
        className="select-none hover:ring-1 hover:text-white ring-white w-full p-4 text-2xl"
      />
    </div>
  );
};

export const VisualNovelActions: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="w-full text-right text-2xl text-slate-200 max-w-prose flex flex-col gap-4 mt-4 mb-10">
      {children}
    </div>
  );
};

export const VisualNovelBody: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="box-border text-2xl text-slate-200 max-w-prose w-full p-6 text-left glass">
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
    <div
      className={`w-full my-5 flex justify-center ${
        row ? "flex-row items-start" : "flex-col items-center"
      }`}
      ref={ref}
    >
      <div
        className={`min-h-[20vh] mb-4 relative wobble ${
          row ? "sticky top-5" : ""
        }`}
      >
        <div className="relative h-[20vh] w-[20vh] max-w-[25vw] max-h-[25vw] ml-auto">
          <div className="absolute top-0 right-0 h-full w-full border-[5px] rounded-[2vh] blur wobble-blur">
          </div>
          <div className="absolute top-0 right-0 h-full w-full border-[5px] rounded-[2vh]">
            {imageUrl && (
              <Image className="h-full w-full rounded-[2vh]" src={imageUrl} />
            )}
          </div>
        </div>
        {header}
      </div>
      {children}
    </div>
  );
});

export const VisualNovelContainerLoading = forwardRef<HTMLDivElement>(
  (p, ref) => {
    return (
      <VisualNovelContainer ref={ref}>
        Loading...
      </VisualNovelContainer>
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
  const isOutsideOfPlaylistTutorial = !location.pathname.startsWith(
    links.home.playlistInstallGuide.root,
  ) && !location.pathname.startsWith(
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
