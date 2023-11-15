import { FC } from "react";
import { tw } from "@/packages/twind/twind.tsx";
import { Link } from "@/packages/ui/Link.tsx";
import { links } from "@/apps/editor/routing.config.ts";

export function EditorLayout({ children }: React.PropsWithChildren) {
  return (
    <div className="main-grid-layout">
      <div className={tw("pt-2 pl-2 flex flex-col gap-2 items-start text-lg")}>
        <Link to={links.home.root}>
          /
        </Link>
        <Link to={links.editor.playlist.list}>
          Playlists
        </Link>
        <br />
        <Link to={links.editor.map.list}>
          Maps
        </Link>
      </div>
      <div className={tw("pt-2")}>
        {children}
      </div>
    </div>
  );
}

export const EditorLayoutShell = (Component: FC) => {
  return (
    <EditorLayout>
      <Component />
    </EditorLayout>
  );
};
