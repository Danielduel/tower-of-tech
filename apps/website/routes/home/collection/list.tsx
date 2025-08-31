import { latestPlaylistReleaseUrl } from "../../../../../packages/utils/constants.ts";

export default function Home() {
  return (
    <div class="container mx-auto max-w-2xl">
      <div>
        Tower of Tech
      </div>
      <div>
        A collection of playlists with rising difficulty.
      </div>
      <div>
        <a
          download
          class="hover:underline"
          href={latestPlaylistReleaseUrl}
        >
          Download archive
        </a>
      </div>
    </div>
  );
}
