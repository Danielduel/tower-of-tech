import {
  FC,
  ForwardRefExoticComponent,
  RefAttributes,
  Suspense,
  useRef,
} from "react";
import { VisualNovelContainerLoading } from "@/apps/editor/components/containers/VisualNovelBox.tsx";

export function MainLayout(
  { children, style }: React.PropsWithChildren & {
    style?: React.CSSProperties;
  },
) {
  return (
    <div
      style={style}
      className="z-10 min-w-min min-h-[100dvh] flex items-center text-white page"
    >
      <div className="container mx-auto">
        {children}
      </div>
    </div>
  );
}

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
