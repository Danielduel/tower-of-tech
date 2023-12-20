import { FC } from "react";
import { trpc } from "../../../../../packages/trpc/trpc-react.ts";
import { MapItem } from "../../../components/MapItem.tsx";

export const MapList: FC = () => {
  const { data: maps } = trpc.map.list.useQuery();
  const { data: beatsaverMaps } = trpc.map.resolve.useQuery({ hashes: maps!.map(x => x.hash)}, { enabled: (maps?.length ?? 0) > 0, staleTime: Infinity });

  return maps
    ? maps
      .map((map) => <MapItem key={map.hash} playlistMapItem={map} beatSaverMapItem={beatsaverMaps && beatsaverMaps[map.hash.toLowerCase()]} />)
    : null;
};
