import { FC } from "react";
import { Link as _Link, LinkProps } from "https://esm.sh/react-router-dom@6.3.0?external=react"
import { tw } from "@/twind/twind.tsx";
import { useResolvedPath } from "react-router-dom";
import { useMatch } from "react-router-dom";

export const Link: FC<LinkProps> = (props) => {
  const resolved = useResolvedPath(props.to);
  const match = useMatch({ path: resolved.pathname, end: true });

  const className = tw("p-1 text-lg hover:ring-1 ring-neutral-500 w-full" + (match ? " underline " : " ") + props.className);

  return <_Link {...props} className={className} />
}
