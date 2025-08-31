import { FunctionComponent } from "preact";
import { useCallback } from "preact/hooks";

export const CopyButton: FunctionComponent<{ copyText: string; childText: string }> = (props) => {
  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(props.copyText);
  }, []);
  return (
    <button
      type="button"
      onClick={handleClick}
      class="px-2 border"
    >
      {props.childText}
    </button>
  );
};

