import { tw } from "@/packages/twind/twind.tsx";
import { Link } from "@/packages/ui/Link.tsx";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="main-grid-layout">
      <div className={tw("pt-2 pl-2 flex flex-col gap-2 items-start text-lg")}>
        <Link to="/playlist/list">
          Playlists
        </Link>
        <br />
        <Link to="/map/list">
          Maps
        </Link>
      </div>
      <div className={tw("pt-2")}>
        { children }
      </div>
    </div>
  );
};
