import { FC, ForwardRefExoticComponent, RefAttributes, Suspense, useRef } from "react";
import { VisualNovelContainerLoading } from "@/apps/website/components/containers/VisualNovelBox.tsx";
import { Link as _Link } from "react-router-dom";
import { LayoutContent, LayoutSidebar, LayoutWrapper } from "@/apps/website/components/layouts/Layout.tsx";

export const PlaylistDetailsLayout = (
  { children, heading, style }: React.PropsWithChildren & {
    style?: React.CSSProperties;
    heading: React.PropsWithChildren["children"];
  },
) => {
  return (
    <LayoutWrapper>
      <LayoutSidebar>
        {heading}
      </LayoutSidebar>
      <LayoutContent style={style}>
        {children}
      </LayoutContent>
    </LayoutWrapper>
  );
};

export const PlaylistDetailsLayoutShell: FC<
  { Component: ForwardRefExoticComponent<RefAttributes<HTMLDivElement>> }
> = (
  { Component },
) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  return (
    <div className="main-gradient">
      <Suspense
        fallback={<VisualNovelContainerLoading ref={nodeRef} />}
      >
        <Component ref={nodeRef} />
      </Suspense>
    </div>
  );
};
