import { FC, Suspense, useRef, useState } from "react";
import { VisualNovelContainerLoading } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { WithMainContainerRef } from "@/packages/ui/refs.ts";

export function MainLayout(
  { children, style }: React.PropsWithChildren & {
    style?: React.CSSProperties;
  },
) {
  return (
    <div
      style={style}
      className="z-10 min-w-min min-h-screen text-white page"
    >
      <div className="container mx-auto">
        {children}
      </div>
    </div>
  );
}

export const MainLayoutShell: FC<{ Component: FC<WithMainContainerRef> }> = (
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
