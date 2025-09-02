// const playerDataR = await fetch(`https://api.beatleader.xyz/player/${beatleaderPlayerId}/scores/compact`, {
//       method: "GET",
//       body: JSON.stringify(data),
//     });
//
//
//     const playerData = playerDataR.json()
//

import { FunctionalComponent } from "preact";
import { useSignal, useSignalEffect } from "@preact/signals";
import { BeatSaberPlaylistSchemaT } from "../../../../packages/types/beatsaber-playlist.ts";
import { CopyButton } from "../CopyButton.tsx";
import { BeatLeaderAPIPlayerByIdScoresCompact } from "../../../../packages/api-beatleader/player/playerByIdScoresCompact.ts";

export const PlaylistDetails: FunctionalComponent<{ playlist: BeatSaberPlaylistSchemaT }> = ({ playlist }) => {
  const playerData = useSignal<null | BeatLeaderAPIPlayerByIdScoresCompact.GET.SuccessSchemaT>();
  useSignalEffect(() => {
    (async () => {
      // const beatleaderPlayerId = "danielduel";
      //
      // // I can't do fetch with body on GET, pushed a patch to BeatLeader
      // const rP = Promise.withResolvers();
      // const r = new XMLHttpRequest();
      // r.open("GET", `https://api.beatleader.xyz/player/${beatleaderPlayerId}/scores/compact`);
      // r.setRequestHeader("Access-Control-Allow-Origin", "*")
      // r.responseType = "json";
      // r.send(JSON.stringify(playlist));
      // r.onload = () => rP.resolve(r.response);
      // const playerData = await rP.promise;
      // console.log(playerData);
    })();
  });

  return (
    <div>
      <div class="m-4">
        <div class="flex flex-row">
          <img class="h-32" src={"data:image/png;base64," + playlist.image} />
          <div class="ml-4">
            <h4>{playlist.playlistTitle}</h4>
            <h5>{playlist.playlistAuthor}</h5>
          </div>
        </div>
      </div>
      <div class="m-6">
        {playlist.songs.map((v) => (
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

              <div>{v.difficulties.map((x) => `${x.name} (${x.characteristic})`).join(", ")}</div>
              <div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
