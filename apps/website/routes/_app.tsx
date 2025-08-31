import { type PageProps } from "$fresh/server.ts";
import { FunctionComponent, JSX } from "preact";

const Link: FunctionComponent<JSX.HTMLAttributes> = (props) => {
  return (
    <a { ...props} />
  )
}

const Heading = () => {
  return (
    <div>
      <Link />
    </div>
  )
}

export default function App({ Component }: PageProps) {
  return (
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>website</title>
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
