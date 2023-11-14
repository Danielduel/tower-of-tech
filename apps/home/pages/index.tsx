import { FC, PropsWithChildren } from "react";
import { playlistMapping } from "@/packages/playlist-mapping/mod.ts";
import { tw } from "@/packages/twind/twind.tsx";
import { trpc } from "@/packages/trpc/trpc.ts";

const PlaylistLink = (
  { displayName }: { displayName: string },
) => {
  return (
    <div className={tw("flex items-center pl-8 border-2 h-12 border-transparent hover:border-black")}>
      {displayName}
      <a className={tw("flex items-center ml-auto px-5 h-full ring-blue-500 hover:ring-2")}>Details</a>
      <a className={tw("flex items-center px-5 h-full ring-blue-500 hover:ring-2")}>Download</a>
    </div>
  );
};

const SectionSection: FC<PropsWithChildren> = ({ children }) => (
  <section className={tw("min-w-full mt-3")}>{children}</section>
);
const SectionTitle: FC<PropsWithChildren> = ({ children }) => (
  <span className={tw("text-4xl font-bold border-t-1 ml-[-1px] border-l-1 p-10 pt-1 pl-1 border-black")}>{children}</span>
);
const SectionDescription: FC<PropsWithChildren> = ({ children }) => (
  <div className={tw("text-2xl ml-4 mt-2 text-[#333]")}>{children}</div>
);
const SectionMapping: FC<PropsWithChildren> = ({ children }) => (
  <div className={tw("text-xl mt-2 text-[#333]")}>{children}</div>
);

export default function Index() {
  const { data: links } = trpc.playlist.listLinks.useQuery();
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
    <div className={tw("mx-auto bg-[#ddd] min-h-[100vh]")}>
      <div className={tw("h-96 mb-[-10rem] w-[100vw] z-[0] bg-no-repeat bg-cover bg-center flex items-end")} style={{ backgroundImage: "url('/cubes_floating.svg')"}}>
        
      <div className={tw("z-[1] mb-[10rem] bg-[#ccc] relative rounded-t-full border-2 border-black border-b-none px-4 py-8 max-w-screen-md w-full mx-auto flex flex-col items-center justify-center")}>
          <h1 className={tw("text-4xl font-bold pt-10")}>Tower of Tech</h1>
          <p className={tw("mt-2")}>
            Welcome to dev version of ToT website.
          </p>
        </div>
      </div>
      <div className={tw("z-[1] bg-[#ccc] relative border-2 border-black border-t-0 px-4 py-8 max-w-screen-md mx-auto flex flex-col items-center justify-center")}>
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
