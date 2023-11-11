import { ComponentChildren } from "preact";
import { getPlaylistsForRoutes } from "../utils/getPlaylistsForRoutes.ts";
import { playlistMapping } from "@/packages/playlist-mapping/mod.ts";

const PlaylistLink = (
  { fileName, displayName }: { fileName: string; displayName: string },
) => {
  const linkName = fileName.replaceAll(" ", "__");

  return (
    <div class="flex items-center pl-8 border-2 h-12 border-transparent hover:border-black">
      {displayName}
      <a href={`/playlist/${linkName}`} class="flex items-center ml-auto px-5 h-full ring-blue-500 hover:ring-2">Details</a>
      <a class="flex items-center px-5 h-full ring-blue-500 hover:ring-2">Download</a>
    </div>
  );
};

const SectionSection = ({ children }: { children: ComponentChildren }) => (
  <section class="min-w-full mt-3">{children}</section>
);
const SectionTitle = ({ children }: { children: ComponentChildren }) => (
  <span class="text-4xl font-bold border-t-1 ml-[-1px] border-l-1 p-10 pt-1 pl-1 border-black">{children}</span>
);
const SectionDescription = ({ children }: { children: ComponentChildren }) => (
  <div class="text-2xl ml-4 mt-2 text-[#333]">{children}</div>
);
const SectionMapping = ({ children }: { children: ComponentChildren }) => (
  <div class="text-xl mt-2 text-[#333]">{children}</div>
);

export default function Home() {
  const list = getPlaylistsForRoutes()
    .sort((a, b) => a > b ? 1 : -1)
    .map((fileName) => ({
      fileName,
      ...playlistMapping[fileName],
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
    <div class="mx-auto bg-[#ddd] min-h-[100vh]">
      <div class="h-96 mb-[-10rem] w-[100vw] z-[0] bg-no-repeat bg-cover bg-center flex items-end" style={{ backgroundImage: "url('/cubes_floating.svg')"}}>
        
      <div class="z-[1] mb-[10rem] bg-[#ccc] relative rounded-t-full border-2 border-black border-b-none px-4 py-8 max-w-screen-md w-full mx-auto flex flex-col items-center justify-center">
          <h1 class="text-4xl font-bold pt-10">Tower of Tech</h1>
          <p class="mt-2">
            Welcome to dev version of ToT website.
          </p>
        </div>
      </div>
      <div class="z-[1] bg-[#ccc] relative border-2 border-black border-t-0 px-4 py-8 max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <SectionSection>
          <SectionTitle>Adep</SectionTitle>
          <SectionDescription>
            Ideal playlists for beginners that are stuck between Expert and
            Expert+ level
            and seek new things to try out.
            This is the first stop for your tech journey!
            {/* First actually complex maps, first handclap, first map that you hate, first... eghm... I am getting too romantic */}
          </SectionDescription>
          <SectionMapping>
            {adepList.map((x) => <PlaylistLink {...x} />)}
          </SectionMapping>
        </SectionSection>

        <SectionSection>
          <SectionTitle>Acc</SectionTitle>
          <SectionDescription>
            New players can find those playlists fast, those maps will carry you
            through new patterns without being too fast.
          </SectionDescription>
          <SectionMapping>
            {accList.map((x) => <PlaylistLink {...x} />)}
          </SectionMapping>
        </SectionSection>

        <SectionSection>
          <SectionTitle>Mid</SectionTitle>
          <SectionDescription>
            It starts to be faster, combines tech with midspeedy pacing and
            ocassional speed patterns but without speed speed, speed speed is
            speedy, this is not speedy. Yet.
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
