import { playlistMapping } from "@/packages/playlist/collections/tower-of-tech/mod.ts";
import { trpc } from "@/packages/trpc/trpc-react.ts";
import { semiconstantCacheQuery } from "@/packages/react-query/constants.ts";

const PlaylistLink = (
  { displayName }: { displayName: string },
) => {
  return (
    <div className="flex items-center pl-8 border-2 h-12 border-transparent hover:border-black">
      {displayName}
      <a className="flex items-center ml-auto px-5 h-full ring-blue-500 hover:ring-2">
        Details
      </a>
      <a className="flex items-center px-5 h-full ring-blue-500 hover:ring-2">
        Download
      </a>
    </div>
  );
};

export default function Index() {
  const { data: links } = trpc.playlist.listLinks.useQuery(undefined, semiconstantCacheQuery);
  if (!links) return;

  const list = links
    .sort((a, b) => a > b ? 1 : -1)
    .map(({ playlistTitle }) => ({
      playlistTitle,
      ...playlistMapping[playlistTitle],
    }));
  const [
    adepList,
    accList,
    midList,
    fasList,
    legacyList,
    otherList,
  ] = [
    list.filter((x) => x.speedCategory === "Adep"),
    list.filter((x) => x.speedCategory === "Acc"),
    list.filter((x) => x.speedCategory === "Mid"),
    list.filter((x) => x.speedCategory === "Fas"),
    list.filter((x) => x.speedCategory === "Legacy"),
    list.filter((x) => x.speedCategory === "Other"),
  ];

  return (
    <div className="mx-auto bg-[#ddd] min-h-[100vh]">
      <div
        className="h-96 mb-[-10rem] w-[100vw] z-[0] bg-no-repeat bg-cover bg-center flex items-end"
        style={{ backgroundImage: "url('/cubes_floating.svg')" }}
      >
        <div className="z-[1] mb-[10rem] bg-[#ccc] relative px-4 py-8 max-w-screen-md w-full mx-auto flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold pt-10">Tower of Tech</h1>
          <p className="mt-2">
            Welcome to dev version of ToT website.
          </p>
        </div>
      </div>
      <div className="z-[1] bg-[#ccc] relative px-4 py-8 max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <SectionSection>
          <SectionTitle>Adep</SectionTitle>
          <SectionDescription>
            Ideal playlists for beginners that are stuck between Expert and Expert+ level and seek new things to try
            out. This is the first stop for your tech journey!
            {/* First actually complex maps, first handclap, first map that you hate, first... eghm... I am getting too romantic */}
          </SectionDescription>
          <SectionMapping>
            {adepList.map((x) => <PlaylistLink {...x} />)}
          </SectionMapping>
        </SectionSection>

        <SectionSection>
          <SectionTitle>Acc</SectionTitle>
          <SectionDescription>
            New players can find those playlists fast, those maps will carry you through new patterns without being too
            fast.
          </SectionDescription>
          <SectionMapping>
            {accList.map((x) => <PlaylistLink {...x} />)}
          </SectionMapping>
        </SectionSection>

        <SectionSection>
          <SectionTitle>Mid</SectionTitle>
          <SectionDescription>
            It starts to be faster, combines tech with midspeedy pacing and ocassional speed patterns but without speed
            speed, speed speed is speedy, this is not speedy. Yet.
          </SectionDescription>
          <SectionMapping>
            {midList.map((x) => <PlaylistLink {...x} />)}
          </SectionMapping>
        </SectionSection>

        <SectionSection>
          <SectionTitle>Fas</SectionTitle>
          <SectionDescription>
            Haha bloq go zoom
          </SectionDescription>
          <SectionMapping>
            {fasList.map((x) => <PlaylistLink {...x} />)}
          </SectionMapping>
        </SectionSection>
      </div>
    </div>
  );
}
