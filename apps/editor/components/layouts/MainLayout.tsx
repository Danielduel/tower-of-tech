import { FC, Suspense, useRef, useState } from "react";
import { Transition } from "react-transition-group";
import { VisualNovelContainerLoading } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { WithMainContainerRef } from "@/packages/ui/refs.ts";

export function MainLayout(
  { children, style }: React.PropsWithChildren & { style: React.CSSProperties },
) {
  return (
    <div
      style={style}
      className="min-w-min min-h-screen bg-black text-white flex justify-center main-gradient"
    >
      <div className="container flex flex-column items-center justify-center">
        {children}
      </div>
    </div>
  );
}

const defaultStyle = {
  transition: `opacity 300ms ease-in-out`,
  opacity: 0,
};

const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

export const MainLayoutShell = (Component: FC<WithMainContainerRef>) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [inProp, setInProp] = useState(true);

  return (
    <Transition nodeRef={nodeRef} in={inProp} timeout={300}>
      {(state) => {
        return (
          <MainLayout
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <Suspense fallback={<VisualNovelContainerLoading ref={nodeRef} />}>
              <Component ref={nodeRef} />
            </Suspense>
          </MainLayout>
        );
      }}
    </Transition>
  );
};
