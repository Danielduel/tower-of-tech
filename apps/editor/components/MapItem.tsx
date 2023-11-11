import { FC, useMemo } from "react";
import { BeatSaberPlaylistSongItemSchema } from "@/packages/types/beatsaber-playlist.ts";
import {
  BeatSaverMapResponseNotFoundSchema,
  BeatSaverMapResponseSchema,
  BeatSaverMapResponseSuccessSchema,
  isBeatSaverMapResponseSuccessSchema,
} from "@/packages/types/beatsaver.ts";
import { tw } from "@/packages/twind/twind.tsx";

type MapItemProps = {
  playlistMapItem?: typeof BeatSaberPlaylistSongItemSchema._type;
  beatSaverMapItem?: typeof BeatSaverMapResponseSchema._type | null;
};

type BeatSaverMatchProps = {
  Success?: FC<
    {
      beatSaver: typeof BeatSaverMapResponseSuccessSchema._type;
      playlistMapItem: typeof BeatSaberPlaylistSongItemSchema._type;
    }
  >;
  NotFound?: FC<
    {
      beatSaver: typeof BeatSaverMapResponseNotFoundSchema._type;
      playlistMapItem: typeof BeatSaberPlaylistSongItemSchema._type;
    }
  >;
  Unknown?: FC<
    { playlistMapItem: typeof BeatSaberPlaylistSongItemSchema._type }
  >;
  Fallback: FC;
};

const useBeatSaverMatch = (props: MapItemProps) => {
  return useMemo(
    () => (innerProps: BeatSaverMatchProps) => {
      if (!props.playlistMapItem) return <innerProps.Fallback />;
      if (!props.beatSaverMapItem) {
        return innerProps.Unknown
          ? <innerProps.Unknown playlistMapItem={props.playlistMapItem} />
          : <innerProps.Fallback />;
      }
      if (isBeatSaverMapResponseSuccessSchema(props.beatSaverMapItem)) {
        return innerProps.Success
          ? (
            <innerProps.Success
              playlistMapItem={props.playlistMapItem}
              beatSaver={props.beatSaverMapItem}
            />
          )
          : <innerProps.Fallback />;
      }
      return innerProps.NotFound
        ? (
          <innerProps.NotFound
            playlistMapItem={props.playlistMapItem}
            beatSaver={props.beatSaverMapItem}
          />
        )
        : <innerProps.Fallback />;
    },
    [props.beatSaverMapItem, props.playlistMapItem],
  );
};

const coverStyle = tw("w-32 h-32");
export const MapItem: FC<MapItemProps> = ({
  playlistMapItem,
  beatSaverMapItem,
}) => {
  if (!playlistMapItem) return null;

  const Field = useBeatSaverMatch({ beatSaverMapItem, playlistMapItem });

  return (
    <div
      key={playlistMapItem.hash}
      className={tw("text-left flex flex-row gap-4 mt-2 text-lg")}
    >
      <div>
        <Field
          Fallback={() => <img className={coverStyle} src={""} />}
          Success={({ beatSaver: { versions: [{ coverURL }] } }) => (
            <img className={coverStyle} src={coverURL} />
          )}
        />
      </div>
      <div>
        <div>{playlistMapItem.songName}</div>
        <div>{playlistMapItem.levelAuthorName}</div>
        <Field
          Fallback={() => null}
          Success={({ beatSaver: { id } }) => (
            <div>{id}</div>
          )}
        />
      </div>
    </div>
  );
};
