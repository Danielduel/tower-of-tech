import {
  serve,
} from "https://deno.land/x/sift@0.6.0/mod.ts";
import { commandRoot } from "./commands/mod.ts";

export function registerServeHttp() {
  serve({
    "/": commandRoot,
  });
}
