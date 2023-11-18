import { FC, Suspense, useRef, useState } from "react";
import { tw } from "@/packages/twind/twind.tsx";
import { Transition } from "react-transition-group";
import { VisualNovelContainerLoading } from "@/apps/editor/components/containers/VisualNovelBox.tsx";
import { WithMainContainerRef } from "@/packages/ui/refs.ts";

export function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <div className={tw("min-w-min min-h-screen bg-black text-white flex justify-center") + " main-gradient"}>
      <div className={tw("container flex flex-column items-center justify-center")}>
        {children}
      </div>
    </div>
  );
}

export const MainLayoutShell = (Component: FC<WithMainContainerRef>) => {
  const [inProp, setInProp] = useState(false);
  const nodeRef = useRef<HTMLDivElement>(null);
  return (
    <MainLayout>
      <Transition nodeRef={nodeRef} in={inProp} timeout={150}>
        <Suspense fallback={<VisualNovelContainerLoading ref={nodeRef} />}>
          <Component ref={nodeRef} />
        </Suspense>
      </Transition>
    </MainLayout>
  );
};