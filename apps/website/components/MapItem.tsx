import { FC, useMemo } from "react";
import {
  BeatSaberPlaylistSongItemDifficultySchema,
  BeatSaberPlaylistSongItemSchema,
} from "@/packages/types/beatsaber-playlist.ts";
import {
  BeatSaverMapResponseNotFoundSchema,
  BeatSaverMapResponseSchema,
  BeatSaverMapResponseSuccessSchema,
  BeatSaverMapResponseVersionsItem,
  isBeatSaverMapResponseSuccessSchema,
} from "@/packages/types/beatsaver.ts";
import { Image } from "@/apps/website/components/Image.tsx";
import { VisualNovelButtonMedium } from "@/apps/website/components/containers/VisualNovelBox.tsx";

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

type DiffT = typeof BeatSaberPlaylistSongItemDifficultySchema._type;
const Difficulty: FC<{ difficulty: DiffT; selected: boolean }> = ({
  difficulty,
  selected,
}) => {
  return (
    <div className={selected ? `text-black` : `text-slate-600`}>
      {difficulty.characteristic} - {difficulty.name}
    </div>
  );
};

type BeatSaverDiffs = typeof BeatSaverMapResponseVersionsItem._type.diffs;
const beatSaverDiffsToDifficulties = (diffs: BeatSaverDiffs): DiffT[] => {
  return diffs.map((diff) => (
    {
      characteristic: diff.characteristic,
      name: diff.difficulty,
    }
  ));
};
const difficultyEquals = (diff1: DiffT, diff2: DiffT) =>
  diff1.characteristic === diff2.characteristic && diff1.name === diff2.name;
const Difficulties: FC<
  { selectedDifficulties?: DiffT[]; availableDifficulties?: DiffT[] }
> = ({
  selectedDifficulties,
  availableDifficulties,
}) => {
  if (!selectedDifficulties) return null;
  if (!availableDifficulties) return null;
  if (selectedDifficulties.length > availableDifficulties.length) return null;

  return availableDifficulties.map((d) => (
    <Difficulty
      key={`${d.characteristic} - ${d.name}`}
      difficulty={d}
      selected={selectedDifficulties.some((s) => difficultyEquals(s, d))}
    />
  ));
};

const coverStyle = "w-32 h-32 min-w-[8rem] min-h-[8rem] rounded-lg";
export const MapItem: FC<MapItemProps> = ({
  playlistMapItem,
  beatSaverMapItem,
}) => {
  if (!playlistMapItem) return null;

  const Field = useBeatSaverMatch({ beatSaverMapItem, playlistMapItem });

  return (
    <div className="glass p-2 mb-2">
      <div
        key={playlistMapItem.hash}
        className="text-left flex flex-row gap-4 text-lg w-prose"
      >
        <div>
          <Field
            Fallback={() => (
              <Image className={coverStyle} width={128} height={128} src={""} />
            )}
            Success={({ beatSaver: { versions: [{ coverURL }] } }) => (
              <Image
                className={coverStyle}
                width={128}
                height={128}
                src={coverURL}
              />
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
        <div>
          <Field
            Fallback={() => null}
            Unknown={({ playlistMapItem: { difficulties } }) => null}
            NotFound={() => null}
            Success={(
              {
                playlistMapItem: { difficulties: selectedDifficulties },
                beatSaver: { versions: [{ diffs }] },
              },
            ) => {
              const availableDifficulties = beatSaverDiffsToDifficulties(diffs);
              return (
                <Difficulties
                  selectedDifficulties={selectedDifficulties}
                  availableDifficulties={availableDifficulties}
                />
              );
            }}
          />
        </div>
      </div>
      <div className="text-right mb-2 mr-6">
        <Field
          Fallback={() => null}
          Success={({ beatSaver: { id } }) => (
            <VisualNovelButtonMedium
              onClick={() => navigator.clipboard.writeText(`!bsr ${id}`)}
              className="text-sm"
            >
              Copy !bsr
            </VisualNovelButtonMedium>
          )}
        />
      </div>
    </div>
  );
};
