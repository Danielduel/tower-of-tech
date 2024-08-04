import { FC, PropsWithChildren } from "react";
import { cn } from "@/packages/utils/classnames.ts";
import { HtmlHTMLAttributes } from "npm:@types/react";

export const LayoutWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="">
      <div className="min-h-[100dvh] max-w-[100dvw] w-max overflow-hidden flex flex-row mx-auto">
        {children}
      </div>
    </div>
  );
};

export const LayoutContent: FC<PropsWithChildren<HtmlHTMLAttributes<HTMLDivElement>>> = ({ children, ...props }) => {
  return (
    <div
      {...props}
      className={cn("z-10 my-10 min-w-[85ch] max-w-[85ch] text-white page", props.className)}
    >
      <div className="container md:mx-auto">
        {children}
      </div>
    </div>
  );
};

export const LayoutSidebar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="hidden md:block w-56 h-[100dvh] text-2xl pt-4 text-left bg-transparent sticky top-0">
      <div className="w-full h-full mx-auto text-white">
        {children}
      </div>
    </div>
  );
};
