import { client } from "zod-api";
import { fetcher } from "@/packages/api-utils/fetcher.ts";
import { getLogger } from "@/packages/api-utils/logger.ts";
import { helixSearchChannelsHeadersSchema, helixSearchChannelsResource } from "./helix-schema/helixSearchChannels.ts";
import {
  helixChannelsResource,
  patchHelixChannelsBodySchema,
  patchHelixChannelsHeadersSchema,
} from "@/packages/api-twitch/helix-schema/helixChannels.ts";
import { helixChannelsAdsResource } from "@/packages/api-twitch/helix-schema/helixChannelsAds.ts";

export const TwitchHelixApiClient = client({
  fetcher,
  baseUrl: "https://api.twitch.tv",
  logger: await getLogger(),
  resources: {
    channels: helixChannelsResource,
    channelsAds: helixChannelsAdsResource,
    searchChannels: helixSearchChannelsResource,
  },
});

export class OpenTwitchHelixApi {
}

export class PublicHelixApi {
}

export class ManagementHelixApi {
  constructor() {}
}

export const getChannelDataByBroadcasterName = async (
  auth: typeof helixSearchChannelsHeadersSchema._type,
  broadcasterName: string,
) => {
  return await TwitchHelixApiClient.searchChannels.get({
    searchParams: {
      query: broadcasterName,
      first: 1,
    },
    headers: {
      ...auth,
    },
  });
};

export const setChannelData = async (
  auth: typeof patchHelixChannelsHeadersSchema._type,
  broadcaster_id: string,
  body: typeof patchHelixChannelsBodySchema._type,
) => {
  return await TwitchHelixApiClient.channels.patch({
    searchParams: { broadcaster_id },
    body,
    headers: {
      ...auth,
    },
  });
};
