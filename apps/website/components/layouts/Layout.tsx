import { FC, PropsWithChildren } from "react";
import { cn } from "../../../../packages/deps/classnames.ts";
import { HTMLProps } from "npm:@types/react";

export const LayoutWrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="min-h-[100dvh] min-w-[100dvw]">
      <div className="w-full lg:container lg:mx-auto flex flex-row">
        {children}
      </div>
    </div>
  );
};

export const LayoutContent: FC<PropsWithChildren<HTMLProps<HTMLDivElement>>> = (
  { children, ...props },
) => {
  return (
    <div
      {...props}
      className={cn("z-10 box-border mx-auto w-full text-white page", props.className)}
    >
      <div className="w-full">
        {children}
      </div>
    </div>
  );
};

export const LayoutSidebar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="hidden md:block min-w-56 w-56 h-max text-2xl pt-4 text-left ml-auto bg-transparent sticky top-0">
      <div className="w-full h-max mx-auto text-white box-border">
        {children}
      </div>
    </div>
  );
};
