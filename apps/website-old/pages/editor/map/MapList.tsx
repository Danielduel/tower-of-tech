import { FC } from "react";
// import { trpc } from "@/packages/trpc/trpc-react.ts";
// import { MapItem } from "@/apps/website/components/MapItem.tsx";
// import { semiconstantCacheQuery } from "@/packages/react-query/constants.ts";

export const MapList: FC = () => {
  // const { data: maps } = trpc.map.list.useQuery(void 0, semiconstantCacheQuery);
  // const { data: beatsaverMaps } = trpc.map.resolve.useQuery({
  //   hashes: maps!.map((x) => x.hash),
  // }, { ...semiconstantCacheQuery, enabled: (maps?.length ?? 0) > 0 });
  // return maps
  //   ? maps
  //     .map((map) => (
  //       <MapItem
  //         key={map.hash}
  //         playlistMapItem={map}
  //         beatSaverMapItem={beatsaverMaps &&
  //           beatsaverMaps[map.hash.toLowerCase()]}
  //       />
  //     ))
  //   : null;

  return "suspended route due to router changes";
};
