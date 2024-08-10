import { z } from "zod";
import { client, resource } from "zod_api/mod.ts";
import { fetcher } from "@/packages/api-utils/fetcher.ts";
import { getLogger } from "@/packages/api-utils/logger.ts";

export const BeatLeaderApi = client({
  fetcher,
  baseUrl: "https://api.beatleader.xyz/",
  logger: await getLogger(),
  resources: {},
});
