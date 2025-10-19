import { FunctionComponent } from "preact";

export const Button: FunctionComponent<{ onClick: (e: MouseEvent) => void }> = (props) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      class="px-2 border"
    >
      {props.children}
    </button>
  );
};

