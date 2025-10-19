import { z } from "zod";
import * as TsBrand from "jsr:@dduel/ts-brand@0.1.0";
import { client, resource } from "zod-api";
import { fetcher } from "@/packages/api-utils/fetcher.ts";
import { getLogger } from "@/packages/api-utils/logger.ts";

export namespace SteamApi {
  export namespace Brand {
    export type BaseURL = TsBrand.Brand<string, "BaseURL">; 
    export const makeBaseURL = TsBrand.make<BaseURL>();

    export type SteamAppId = TsBrand.Brand<number, "SteamAppId">;
    export const makeSteamAppId = TsBrand.make<SteamAppId>();
    export const zodSteamAppId = z.number().transform(makeSteamAppId);

    export type SteamWebApiKey = TsBrand.Brand<string, "SteamWebApiKey">;
    export const makeSteamWebApiKey = TsBrand.make<SteamWebApiKey>();
    export const zodSteamWebApiKey = z.string().transform(makeSteamWebApiKey);

    export type SteamUserId = TsBrand.Brand<number, "SteamUserId">;
    export const makeSteamUserId = TsBrand.make<SteamUserId>();
    export const zodSteamUserId = z.number().transform(makeSteamUserId);

    export type TimeInMinutes = TsBrand.Brand<number, "TimeInMinutes">;
    export const makeTimeInMinutes = TsBrand.make<TimeInMinutes>();
    export const zodTimeInMinutes = z.number().transform(makeTimeInMinutes);

    export type UnixSecondsTimestamp = TsBrand.Brand<number, "UnixSecondsTimestamp">;
    export const makeUnixSecondsTimestamp = TsBrand.make<UnixSecondsTimestamp>();
    export const zodUnixSecondsTimestamp = z.number().transform(makeUnixSecondsTimestamp);
  }

  export const defaultBaseUrl = Brand.makeBaseURL("http://api.steampowered.com");

  export namespace IPlayerServiceGetOwnedGamesV0001 {
    export const SearchParams = z.object({
      key: Brand.zodSteamWebApiKey,
      steamid: Brand.zodSteamUserId,
    });
    export type SearchParamsT = typeof SearchParams.shape;

    export const SuccessItemFull = z.object({
      appid: Brand.zodSteamAppId,
      playtime_forever: Brand.zodTimeInMinutes,
      playtime_windows_forever: Brand.zodTimeInMinutes,
      playtime_mac_forever: Brand.zodTimeInMinutes,
      playtime_linux_forever: Brand.zodTimeInMinutes,
      playtime_deck_forever: Brand.zodTimeInMinutes,
      rtime_last_played: Brand.zodUnixSecondsTimestamp,
      playtime_disconnected: Brand.zodTimeInMinutes,
    });
    
    export const SuccessItemPartial = z.object({
      appid: Brand.zodSteamAppId,
      playtime_forever: Brand.zodTimeInMinutes
    });


    export const Success = z.object({
      response: z.union([
        z.object({
          game_count: z.number(),
          games: z.array(SuccessItemFull),
        }),
        z.object({
          game_count: z.number(),
          games: z.array(SuccessItemPartial)
        }),
        z.object({})
      ])
    });

    export const ResourcePath = "/IPlayerService/GetOwnedGames/v0001/";
    export const Resource = resource(ResourcePath, {
      actions: {
        get: {
          searchParamsSchema: SearchParams,
          dataSchema: Success,
        },
      },
    });
  };

  export const _createClient = async (baseUrl: string) => {
    return client({
      fetcher,
      baseUrl: baseUrl,
      logger: await getLogger(),
      resources: {
        getOwnedGames: IPlayerServiceGetOwnedGamesV0001.Resource,
      },
    });
  }
  export type Client = Awaited<ReturnType<typeof _createClient>>;
  export const _clients: Record<Brand.BaseURL, Client> = {};
  export const getClient = async (baseUrl: Brand.BaseURL = defaultBaseUrl) => {
    if (baseUrl in _clients) {
      return _clients[baseUrl];
    }
    const client = await _createClient(baseUrl);
    _clients[baseUrl] = client;
    return client;
  }
}

