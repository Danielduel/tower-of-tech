import { FC, PropsWithChildren } from "react";
import { playlistMapping } from "@/packages/playlist-mapping/mod.ts";
import { trpc } from "@/packages/trpc/trpc-react.ts";
import { VisualNovelContainer } from "@/apps/editor/components/containers/VisualNovelBox.tsx";

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

const SectionSection: FC<PropsWithChildren> = ({ children }) => (
  <section className="min-w-full mt-3">{children}</section>
);
const SectionTitle: FC<PropsWithChildren> = ({ children }) => (
  <span className="text-4xl font-bold m-r-auto border-t-1 ml-[-1px] border-l-1 p-10 pt-1 pl-1 border-black text-left">
    {children}
  </span>
);
const SectionDescription: FC<PropsWithChildren> = ({ children }) => (
  <div className="text-2xl ml-4 mt-2 text-left">{children}</div>
);
const SectionMapping: FC<PropsWithChildren> = ({ children }) => (
  <div className="text-xl mt-2">{children}</div>
);

export const Browse = () => {
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
    <VisualNovelContainer>
      <div className="mx-auto min-h-[100vh]">
        <div className="z-[1] relative px-4 py-8 max-w-screen-md mx-auto flex flex-col items-center justify-center">
          <SectionSection>
            <SectionTitle>Adep</SectionTitle>
            <SectionDescription>
              Ideal playlists for beginners that are stuck between Expert and
              Expert+ level and seek new things to try out. This is the first
              stop for your tech journey!
              {/* First actually complex maps, first handclap, first map that you hate, first... eghm... I am getting too romantic */}
            </SectionDescription>
            <SectionMapping>
              {adepList.map((x) => <PlaylistLink {...x} />)}
            </SectionMapping>
          </SectionSection>

          <SectionSection>
            <SectionTitle>Acc</SectionTitle>
            <SectionDescription>
              New players can find those playlists fast, those maps will carry
              you through new patterns without being too fast.
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
    </VisualNovelContainer>
  );
};
