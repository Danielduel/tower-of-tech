// @see https://twind.style/library-mode
import {
  cssom,
  injectGlobal as injectGlobal$,
  keyframes as keyframes$,
  stringify as stringify$,
  twind,
  tx as tx$,
  virtual
} from "@twind/core";
import config from "./twind.config.ts";

export const sheet = typeof Deno === "undefined"
  ? cssom("style#__twind")
  : virtual();

// @ts-ignore twind type issue
export const tw = twind(
  config,
  sheet,
);

export const TwindStyleTag = () => <style id="__twind">{stringify$(tw.target)}</style>;

export const tx = tx$.bind(tw);
export const injectGlobal = injectGlobal$.bind(tw);
export const keyframes = keyframes$.bind(tw);
