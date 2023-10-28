import { tw } from "@/twind/twind.tsx";
import { trpc } from "@/trpc/trpc.ts";
import { useCallback } from "react";

export default function PlaylistList() {
  const { data } = trpc.playlist.list.useQuery();
  const { mutateAsync } = trpc.playlist.create.useMutation();
  const handleClick = useCallback(() => {
    mutateAsync();
  }, [])
  return (
    <div className={tw("")}>
      <div>
        Playlist List
      </div>
      <div>
        { data && data.map(playlist => <div>{JSON.stringify(playlist)}</div>) }
        <button onClick={handleClick}>
          Add
        </button>
      </div>
    </div>
  );
};
