import useAsset from "ultra/hooks/use-asset.js";
// Twind
import { TwindStyleTag } from "@/twind/twind.tsx";
import { ImportMapScript } from "ultra/lib/react/client.js";
import { queryClient } from "@/react-query/query-client.ts";

import ShellApp from "./shell-app.tsx";
import { dehydrate } from "@tanstack/react-query";

export default function Shell() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <title>Ultra</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href={useAsset("/favicon.ico")} />
        <link rel="stylesheet" href={useAsset("/style.css")} />
        <ImportMapScript />
      </head>
      <body>
        <div id="root">
          <ShellApp />
        </div>
      </body>
      <TwindStyleTag />
      <script
        dangerouslySetInnerHTML={{
          __html: "window.__REACT_QUERY_DEHYDRATED_STATE = " +
          JSON.stringify(dehydrate(queryClient))
        }}
      ></script>
    </html>
  );
};
