import { forwardRef, PropsWithChildren, useState } from "react";
import { LinkProps } from "react-router-dom";
import { Link } from "@/packages/ui/Link.tsx";
import { AnchorHTMLAttributes, FC, HtmlHTMLAttributes } from "npm:@types/react";
import { links } from "@/apps/editor/routing.config.ts";

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
        className="cursor-pointer select-none box-border inline hover:ring-1 ring-white p-4 text-2xl"
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
        className="select-none hover:ring-1 ring-white w-full p-4 text-2xl"
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
  PropsWithChildren
>(({ children }, ref) => {
  return (
    <div
      className="w-full flex flex-col items-center justify-center"
      ref={ref}
    >
      <div className="min-h-[30vh] mb-4 relative">
        <div className="relative h-[30vh] w-[30vh]"></div>
        <div className="absolute top-[5vh] left-[5vh] h-[20vh] w-[20vh] border-[5px] rounded-[2vh] blur">
        </div>
        <div className="absolute top-[5vh] left-[5vh] h-[20vh] w-[20vh] border-[5px] rounded-[2vh]">
        </div>
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

export const VisualNovelStep: FC<PropsWithChildren> = (
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

export const VisualNovelStepExplanation: FC<PropsWithChildren> = (
  { children },
) => {
  return (
    <div className="text-lg border-l-2 text-cyan-50 pl-5 mt-2">{children}</div>
  );
};

export const VisualNovelStepInlineATag: FC<
  AnchorHTMLAttributes<HTMLAnchorElement>
> = (
  props,
) => {
  return (
    <a
      className="border px-4 py-1 box-content h-8 ml-4 mr-1"
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

export const VisualNovelOneClickAnchor = (
  { href, name }: { href: string; name: string },
) => {
  const [visited, setVisited] = useState(false);
  return (
    <a
      className={"hover:ring-1 ring-white border min-w-0 inline-block px-4 py-1 box-content h-8 ml-2 mb-2 " +
        (visited ? "opacity-50" : "")}
      href={`bsplaylist://playlist/${location.origin}${href}`}
      onClick={() => setVisited(true)}
    >
      {name}
    </a>
  );
};
