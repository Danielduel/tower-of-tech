import {
  ExtractPathMatch,
  HandlerContextBase,
  MatchHandler,
} from "https://raw.githubusercontent.com/Danielduel/rutt/cc92a9ea0f94514f48e583aae01bbaa00fc76397/mod.ts";

export type HandlerForRoute<Route extends string> = MatchHandler<
  HandlerContextBase,
  ExtractPathMatch<Route>
>;
