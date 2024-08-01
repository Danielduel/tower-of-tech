import { FC, PropsWithChildren } from "react";

export const SectionSection: FC<PropsWithChildren> = ({ children }) => (
  <section className="min-w-full mt-3">{children}</section>
);
export const SectionTitle: FC<PropsWithChildren> = ({ children }) => (
  <span className="text-4xl font-bold m-r-auto border-t-1 ml-[-1px] border-l-1 p-10 pt-1 pl-1 border-black text-left">
    {children}
  </span>
);
export const SectionDescription: FC<PropsWithChildren> = ({ children }) => (
  <div className="text-2xl ml-4 mt-2 text-[#333] text-left">{children}</div>
);
export const SectionMapping: FC<PropsWithChildren> = ({ children }) => (
  <div className="text-xl mt-2 text-[#333]">{children}</div>
);
