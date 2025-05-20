import { client } from "zod-api";
import { fetcher } from "@/packages/api-utils/fetcher.ts";
import { getLogger } from "@/packages/api-utils/logger.ts";
import {
  helixSearchChannelsHeadersSchema,
  helixSearchChannelsResource,
} from "@/packages/api-twitch/helix/helixSearchChannels.ts";
import {
  helixChannelsResource,
  patchHelixChannelsBodySchema,
  patchHelixChannelsHeadersSchema,
} from "@/packages/api-twitch/helix/helixChannels.ts";
import { helixChannelsAdsResource } from "@/packages/api-twitch/helix/helixChannelsAds.ts";
import { helixChannelsAdsHeadersSchema } from "@/packages/api-twitch/helix/helixChannelsAds.ts";
import { BroadcasterId } from "@/packages/api-twitch/helix/brand.ts";
import { helixUsersResource } from "@/packages/api-twitch/helix/helixUsers.ts";
import { helixChannelsAdsScheduleSnoozeResource } from "@/packages/api-twitch/helix/helixChannelsAdsScheduleSnooze.ts";
import { helixChannelPointsCustomRewardsResource } from "@/packages/api-twitch/helix/helixChannelPointsCustomRewards.ts";
import { helixChatShoutoutResource } from "@/packages/api-twitch/helix/helixChatShoutouts.ts";
import { helixChatAnnouncementsResource } from "@/packages/api-twitch/helix/helixChatAnnouncements.ts";
import { helixStreamsResource } from "@/packages/api-twitch/helix/helixStreams.ts";
import { helixEventSubSubscriptionsResource } from "@/packages/api-twitch/helix/helixEventSubSubscriptions.ts";

export const TwitchHelixApiClient = client({
  fetcher,
  baseUrl: "https://api.twitch.tv",
  logger: await getLogger(),
  resources: {
    eventSubSubsciptions: helixEventSubSubscriptionsResource,
    channels: helixChannelsResource,
    channelsAds: helixChannelsAdsResource,
    channelsAdsScheduleSnoozeResource: helixChannelsAdsScheduleSnoozeResource,
    channelPointsCustomRewardsResource: helixChannelPointsCustomRewardsResource,
    chatAnnouncements: helixChatAnnouncementsResource,
    chatShoutoutResource: helixChatShoutoutResource,
    searchChannels: helixSearchChannelsResource,
    users: helixUsersResource,
    streams: helixStreamsResource,
  },
});

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

export const getChannelAds = async (
  auth: typeof helixChannelsAdsHeadersSchema._type,
  broadcaster_id: BroadcasterId,
) => {
  return await TwitchHelixApiClient.channelsAds.get({
    searchParams: {
      broadcaster_id,
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

