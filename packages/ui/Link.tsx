import { FC } from "react";
import {
  Link as _Link,
  LinkProps,
} from "https://esm.sh/react-router-dom@6.3.0?external=react";
import { useResolvedPath } from "react-router-dom";
import { useMatch } from "react-router-dom";

export const Link: FC<LinkProps> = (props) => {
  const resolved = useResolvedPath(props.to);
  const match = useMatch({ path: resolved.pathname, end: true });

  const className =
    `select-none p-1 text-lg hover:ring-1 ring-white w-full ${props.className} ${(match
      ? " underline "
      : " ")}`;

  return <_Link {...props} className={className} />;
};
