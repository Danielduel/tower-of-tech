import { type PageProps } from "$fresh/server.ts";
import { FunctionComponent, JSX } from "preact";

const Link: FunctionComponent<JSX.HTMLAttributes> = (props) => {
  return <a class="first:ml-0 ml-4 text-2xl hover:underline" {...props} />;
};

const Heading = () => {
  return (
    <div class="ml-4">
      <div class="px-4 py-8 mx-auto">
        <div class="max-w-screen-md mx-auto flex flex-row items-center justify-center">
          <Link href="/home">Home</Link>
          <Link href="/home/collection/list">Collections</Link>
          <Link href="/home/playlist/list">Playlists</Link>
        </div>
      </div>
    </div>
  );
};

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Tower of Tech</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="w-dvw h-dvh bg-[#3b4252] text-[#eceff4] text-lg">
        <Heading />
        <Component />
      </body>
    </html>
  );
}
