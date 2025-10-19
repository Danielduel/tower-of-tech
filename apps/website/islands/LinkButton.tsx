import { FunctionComponent } from "preact";

export const LinkButton: FunctionComponent<{ href: string, download?: boolean }> = (props) => {
  return (
    <a
      type="button"
      class="px-2 border"
      href={props.href}
      download={props.download}
    >
      {props.children}
    </a>
  );
};

