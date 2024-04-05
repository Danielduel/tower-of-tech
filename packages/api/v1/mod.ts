import {
  apiV1HandlerGetPlaylistByIdOneClick,
  apiV1HandlerGetPlaylistByIdOneClickRoute,
} from "@/packages/api/v1/playlist/get.ts";
import {
  apiV1HandlerGetPlaylistById,
  apiV1HandlerGetPlaylistByIdDownload,
  apiV1HandlerGetPlaylistByIdDownloadRoute,
  apiV1HandlerGetPlaylistByIdRoute,
} from "@/packages/api/v1/playlist/get.ts";
import { router } from "https://raw.githubusercontent.com/Danielduel/rutt/cc92a9ea0f94514f48e583aae01bbaa00fc76397/mod.ts";

const route = router({
  [apiV1HandlerGetPlaylistByIdRoute]: apiV1HandlerGetPlaylistById,
  [apiV1HandlerGetPlaylistByIdDownloadRoute]:
    apiV1HandlerGetPlaylistByIdDownload,
  [apiV1HandlerGetPlaylistByIdOneClickRoute]:
    apiV1HandlerGetPlaylistByIdOneClick,
});

export const apiV1Handler = async (request: Request) => {
  return await route(request, { remoteAddr: [][0] });
};
