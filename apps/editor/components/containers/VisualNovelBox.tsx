import { FC, PropsWithChildren, useState } from "react";
import { tw } from "@/packages/twind/twind.tsx";
import { LinkProps } from "https://esm.sh/react-router-dom@6.3.0?external=react"
import { Link } from "@/packages/ui/Link.tsx";

type VisualNovelContainerProps = PropsWithChildren & {
  title?: string;
  links: LinkProps[];
}

const VisualNovelAction = (props: LinkProps) => {
  return (
    <div className={tw("border-r-4 border-gray mt-5")}>
      <Link {...props} className={tw("p-4 !text-2xl")} />
    </div>
  );
}

export const VisualNovelContainer: FC<VisualNovelContainerProps> = ({ children, title, links }) => {
  return (
    <div className={tw("w-full flex flex-col items-center justify-center")}>
      <div className={tw("box-border text-2xl bg-zinc-800 text-slate-200 max-w-prose bg-white w-full p-6 text-left")}>
        <div>
          {
            title?.length
            ? <div className={tw("text-lg")}>{title}</div>
            : null
          }
        </div>
        <div>
          { children }
        </div>
      </div>
      <div className={tw("w-full text-right text-2xl text-slate-200 max-w-prose flex flex-col gap-4")}>
        {
          links.map(linkProps => <VisualNovelAction {...linkProps} />)
        }
      </div>
    </div>
  )
};

export const VisualNovelContainerLoading = () => {
  return (
    <VisualNovelContainer
      title="System"
      links={[]}
    >
      Loading...
    </VisualNovelContainer>
  )
}