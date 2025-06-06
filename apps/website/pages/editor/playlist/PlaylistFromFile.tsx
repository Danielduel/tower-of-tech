import { FC, FormEventHandler, useState } from "react";
import { BeatSaberPlaylistSchema, BeatSaberPlaylistWithoutIdSchema } from "@/packages/types/beatsaber-playlist.ts";
import { Playlist } from "@/apps/website/pages/editor/playlist/PlaylistItem.tsx";
import { trpc } from "@/packages/trpc/trpc-react.ts";
import { filterNulls } from "@/packages/utils/filter.ts";
import { migrateBeatSaberPlaylistWithoutIdSchema } from "@/packages/playlist/migrate.ts";

export const PlaylistFromFile: FC = () => {
  const [playlists, setPlaylists] = useState<
    typeof BeatSaberPlaylistWithoutIdSchema._type[] | null
  >(null);
  const { mutate } = trpc.playlist.createOrUpdate.useMutation();

  const handlePlaylistInput: FormEventHandler<HTMLInputElement> = async (
    change,
  ) => {
    console.log(change.currentTarget.value);
    const input = change.target;
    if (
      "files" in input && input.files instanceof FileList &&
      input.files.length > 0
    ) {
      const readPlaylists = await Promise.all(
        [...input.files].map(async (file): Promise<(typeof BeatSaberPlaylistWithoutIdSchema._type) | null> => {
          const reader = new FileReader();
          const content = await new Promise((resolve, reject) => {
            reader.onload = (event) => resolve(event.target?.result);
            reader.onerror = (error) => reject(error);
            reader.readAsText(file);
          });
          const object = JSON.parse(content as string);
          try {
            const playlistParsed = await BeatSaberPlaylistWithoutIdSchema.parseAsync(
              object,
            );

            return migrateBeatSaberPlaylistWithoutIdSchema(playlistParsed);
          } catch (err) {
            console.error(`In ${file.name}`, err);
            return null;
          }
        }),
      );
      setPlaylists(readPlaylists.filter(filterNulls));
    }
  };

  console.log("render");
  return (
    <div>
      <button
        onClick={async () => {
          if (playlists) {
            await Promise.all(playlists.map((playlist) => {
              return mutate([playlist]);
            }));
          }
        }}
      >
        Publish
      </button>
      <input
        name="playlist_file"
        type="file"
        multiple
        onInput={handlePlaylistInput}
      />
      {playlists &&
        playlists.map((playlist) => (
          <Playlist
            key={playlist.customData?.id}
            prependKey={playlist.customData?.id}
            playlist={playlist as typeof BeatSaberPlaylistSchema._type}
          />
        ))}
    </div>
  );
};
