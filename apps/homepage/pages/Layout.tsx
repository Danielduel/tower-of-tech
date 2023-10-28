import { tw } from "@/twind/twind.tsx";
import { Link } from "react-router-dom";

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className={tw("w-full grid gap-4 main-grid-layout")}>
      <div className={tw("pt-10")}>
        <Link to="/playlist/list">
          Playlists
        </Link>
      </div>
      <div className={tw("pt-10")}>
        { children }
      </div>
    </div>
  );
};
