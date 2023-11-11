import { BeatSaberPlaylistSongItemSchema } from "@/packages/types/beatsaber-playlist.ts";
import {
  BeatSaverMapResponseNotFoundSchema,
  BeatSaverMapResponseSchema,
  BeatSaverMapResponseSuccessSchema,
  isBeatSaverMapResponseSuccessSchema,
} from "@/packages/types/beatsaver.ts";

type MapItemProps = {
  playlistMapItem?: typeof BeatSaberPlaylistSongItemSchema._type;
  beatSaverMapItem?: typeof BeatSaverMapResponseSchema._type | null;
};

type BeatSaverMatchProps = {
  Success?: (props: {
    beatSaver: typeof BeatSaverMapResponseSuccessSchema._type;
    playlistMapItem: typeof BeatSaberPlaylistSongItemSchema._type;
  }) => any;
  NotFound?: (props: {
    beatSaver: typeof BeatSaverMapResponseNotFoundSchema._type;
    playlistMapItem: typeof BeatSaberPlaylistSongItemSchema._type;
  }) => any;
  Unknown?: (
    props: { playlistMapItem: typeof BeatSaberPlaylistSongItemSchema._type },
  ) => any;
  Fallback: () => any;
};

const useBeatSaverMatch = (props: MapItemProps) => {
  return (
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
    }
  );
};

const coverStyle = "w-32 h-32";
export const MapItem = ({
  playlistMapItem,
  beatSaverMapItem,
}: MapItemProps) => {
  if (!playlistMapItem) return null;

  const Field = useBeatSaverMatch({ beatSaverMapItem, playlistMapItem });

  return (
    <div
      key={playlistMapItem.hash}
      className="text-left flex flex-row gap-4 mt-2 text-lg"
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
          Success={({ beatSaver: { id } }) => <div>{id}</div>}
        />
      </div>
    </div>
  );
};
