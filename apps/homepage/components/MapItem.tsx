import { FC } from "react";
import { BeatSaberPlaylistSongItemSchema } from "@/types/beatsaber-playlist.ts";
import { BeatSaverMapResponseSchema, BeatSaverMapResponseSuccessSchema } from "@/types/beatsaver.ts";
import { tw } from "@/twind/twind.tsx";

type MapItemProps = {
  playlistMapItem?: typeof BeatSaberPlaylistSongItemSchema._type;
  beatSaverMapItem?: typeof BeatSaverMapResponseSchema._type | null;
}

export const MapItem: FC<MapItemProps> = ({
  playlistMapItem,
  beatSaverMapItem,
}) => {

  if (!playlistMapItem) return null;
  console.log(beatSaverMapItem)
  if (beatSaverMapItem && "versions" in beatSaverMapItem) {
    return (
      <div key={playlistMapItem.hash} className={tw("text-left flex flex-row gap-4")}>
        <div>
          <img className={tw("w-8 h-8")} src={beatSaverMapItem?.versions[0].coverURL} />
        </div>
        <div>
          <div>{playlistMapItem.songName}</div>
        </div>
      </div>
    );
  }

  return( 
  <div key={playlistMapItem.hash} className={tw("text-left flex flex-row gap-4")}>
    <div>
      <img className={tw("w-8 h-8")} src={""} />
    </div>
    <div>
      <div>{playlistMapItem.songName}</div>
    </div>
  </div>)
};
