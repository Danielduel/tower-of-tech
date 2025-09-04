import { FunctionalComponent } from "preact";
import { BeatSaberPlaylistSchemaT } from "../../../../packages/types/beatsaber-playlist.ts";
import { CopyButton } from "../CopyButton.tsx";
import { BeatLeaderAPIPlayerByIdScoresCompact } from "../../../../packages/api-beatleader/player/playerByIdScoresCompact.ts";
import { makeUppercaseMapHash } from "@/packages/types/brands.ts";

const beatLeaderDiffIntToDiffName = (i: number) => {
  switch (i) {
    case 1:
      return "Easy";
    case 3:
      return "Normal";
    case 5:
      return "Hard";
    case 7:
      return "Expert";
    case 9:
      return "ExpertPlus";
  }
};

export const PlaylistDetails: FunctionalComponent<
  {
    playlist: BeatSaberPlaylistSchemaT;
    beatLeaderCompactScores?: BeatLeaderAPIPlayerByIdScoresCompact.GET.ItemT[];
    imageUrl?: string;
  }
> = ({ playlist, beatLeaderCompactScores, imageUrl }) => {
  const imageSource = imageUrl ?? `data:image/png;base64,${playlist.image}`;

  return (
    <div>
      <div class="m-4">
        <div class="flex flex-row">
          <img class="h-32" src={imageSource} />
          <div class="ml-4">
            <h4>{playlist.playlistTitle}</h4>
            <h5>{playlist.playlistAuthor}</h5>
          </div>
        </div>
      </div>
      <div class="m-6">
        {playlist.songs.map((v) => {
          return (
            <div class="flex flex-row m-4">
              <img class="h-20 w-20" src={v.coverUrl} />
              <div class="ml-4">
                <div>{v.songName}</div>
                <div>{v.levelAuthorName}</div>
                <div>
                  {v.key
                    ? <CopyButton childText={`!bsr ${v.key}`} copyText={`!bsr ${v.key}`} />
                    : "Unavailable on BeatSaver"}
                </div>

                <div>
                  {v?.difficulties?.map((x) => {
                    const score = beatLeaderCompactScores?.find((y) => {
                      return (
                        v.hash === makeUppercaseMapHash(y.leaderboard.songHash) &&
                        x.name === beatLeaderDiffIntToDiffName(y.leaderboard.difficulty) &&
                        x.characteristic === y.leaderboard.modeName
                      );
                    });
                    const scoreFcDesc = score ? score.score.fullCombo ? " (FC)" : "" : "";
                    const scoreDesc = score ? ` [scored ${~~(score.score.accuracy * 10000) / 100}%${scoreFcDesc}]` : "";

                    return {
                      childText: `${x.name} (${x.characteristic})${scoreDesc}`,
                      copyText: `!bsr ${v.key} (${x.characteristic} ${x.name})`
                    };
                  }).map((x) => {
                    return (
                      <div>
                        {v.key
                          ? <CopyButton childText={x.childText} copyText={x.copyText} />
                          : x.childText}
                      </div>
                    );
                  })}
                </div>
                <div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
