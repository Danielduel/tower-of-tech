import { FC, Suspense } from "react";
import { tw } from "@/packages/twind/twind.tsx";
import { VisualNovelContainerLoading } from "@/apps/editor/components/containers/VisualNovelBox.tsx";

export function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <div className={tw("min-w-min min-h-screen bg-black text-white flex justify-center")}>
      <div className={tw("container flex flex-column items-center justify-center")}>
        {children}
      </div>
    </div>
  );
}

export const MainLayoutShell = (Component: FC) => {
  return (
    <MainLayout>
      <Suspense fallback={<VisualNovelContainerLoading />}>
        <Component />
      </Suspense>
    </MainLayout>
  );
};