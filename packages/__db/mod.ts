/// <reference lib="deno.unstable" />

import "https://deno.land/std@0.206.0/dotenv/load.ts";
import { kvdex } from "@/packages/deps/kvdex.ts";
import { isDbEditorRemote, isLocal } from "@/packages/utils/envrionment.ts";
import {
  Auth,
  BeatSaberPlaylist,
  BeatSaverResponse,
  DiscordGuild,
  ResendLink,
  TwitchRedeem,
} from "@tot/db-schema";
import type { BeatSaverIdToHashCacheSchemaT, BeatSaverResponseWrapperSchemaT } from "@/packages/types/beatsaver.ts";
import type {
  BeatSaberPlaylistFlatSchemaT,
  BeatSaberPlaylistSongItemMetadataSchemaT,
} from "@/packages/types/beatsaber-playlist.ts";
import type { BeatSaberPlaylistSongItemSchemaT } from "@/packages/types/beatsaber-playlist.ts";
import type { DiscordChannelSchemaT, DiscordGuildFlatSchemaT } from "@/packages/types/discord-guild.ts";
import type {
  BeatLeaderAuthorizationSchemaT,
  BeatLeaderIntegrationSchemaT,
  DiscordAuthorizationSchemaT,
  DiscordIntegrationSchemaT,
  ToTAccountFlatSchemaT,
  ToTAccountSessionSchemaT,
  TwitchAuthorizationSchemaT,
  TwitchIntegrationSchemaT,
} from "@/packages/types/auth.ts";
import type {
  ResendLinkTwitchBeatSaverResolvableIdKindSchemaT,
  ResendLinkTwitchChannelSettingsFlatSchemaT,
} from "@/packages/types/resendLink.ts";

export namespace DB {
  export const schema = {
    BeatSaverResponseWrapper: BeatSaverResponse.BeatSaverResponseWrapper,
    BeatSaverMapResponseSuccess: BeatSaverResponse.BeatSaverMapResponseSuccess,
    BeatSaverIdToHashCache: BeatSaverResponse.BeatSaverIdToHashCache,
    BeatSaberPlaylist: BeatSaberPlaylist.BeatSaberPlaylist,
    BeatSaberPlaylistSongItemMetadata: BeatSaberPlaylist.BeatSaberPlaylistSongItemMetadata,
    BeatSaberPlaylistSongItem: BeatSaberPlaylist.BeatSaberPlaylistSongItem,
    DiscordChannel: DiscordGuild.DiscordChannel,
    DiscordGuild: DiscordGuild.DiscordGuild,
    ToTAccount: Auth.ToTAccount,
    ToTAccountSession: Auth.ToTAccountSession,
    BeatLeaderIntegration: Auth.BeatLeaderIntegration,
    BeatLeaderAuthorization: Auth.BeatLeaderAuthorization,
    DiscordIntegration: Auth.DiscordIntegration,
    DiscordAuthorization: Auth.DiscordAuthorization,
    TwitchIntegration: Auth.TwitchIntegration,
    TwitchAuthorization: Auth.TwitchAuthorization,
    TwitchRedeemMapping: TwitchRedeem.TwitchRedeemMapping,
    ResendLinkTwitchBeatSaverResolvableIdKind: ResendLink.ResendLinkTwitchBeatSaverResolvableIdKind,
    ResendLinkTwitchChannelSettings: ResendLink.ResendLinkTwitchChannelSettings,
  };

  let kv: Deno.Kv | null = null;
  const createKv = async () => {
    return isDbEditorRemote()
      ? await (async () => {
        Deno.env.set(
          "DENO_KV_ACCESS_TOKEN",
          Deno.env.get("DD_EDITOR_KV_TOKEN")!,
        );
        return await Deno.openKv(Deno.env.get("DD_EDITOR_KV_URL"));
      })()
      : isLocal()
      ? await Deno.openKv("./local.db")
      : await Deno.openKv();
  };
  export const getKv = async () => {
    if (!kv) kv = await createKv();
    return kv;
  };

  const _create = (kv: Deno.Kv) => kvdex(kv, schema);
  export type Client = ReturnType<typeof _create>;
  let db: null | Client = null;
  const create = async () => {
    const kv = await getKv();
    return _create(kv);
  };

  export const get = async () => {
    if (!db) db = await create();
    return db;
  };

  export type DbSchemas = Record<keyof Client, unknown> & {
    BeatSaverResponseWrapper: BeatSaverResponseWrapperSchemaT;
    BeatSaberPlaylist: BeatSaberPlaylistFlatSchemaT;
    BeatSaberPlaylistSongItemMetadata: BeatSaberPlaylistSongItemMetadataSchemaT;
    BeatSaberPlaylistSongItem: BeatSaberPlaylistSongItemSchemaT;
    BeatSaverIdToHashCache: BeatSaverIdToHashCacheSchemaT;
    DiscordChannel: DiscordChannelSchemaT;
    DiscordGuild: DiscordGuildFlatSchemaT;
    ToTAccount: ToTAccountFlatSchemaT;
    ToTAccountSession: ToTAccountSessionSchemaT;
    BeatLeaderIntegration: BeatLeaderIntegrationSchemaT;
    BeatLeaderAuthorization: BeatLeaderAuthorizationSchemaT;
    DiscordIntegration: DiscordIntegrationSchemaT;
    DiscordAuthorization: DiscordAuthorizationSchemaT;
    TwitchIntegration: TwitchIntegrationSchemaT;
    TwitchAuthorization: TwitchAuthorizationSchemaT;
    TwitchRedeemMapping: TwitchRedeem.TwitchRedeemMappingSchemaT;
    ResendLinkTwitchBeatSaverResolvableIdKind: ResendLinkTwitchBeatSaverResolvableIdKindSchemaT;
    ResendLinkTwitchChannelSettings: ResendLinkTwitchChannelSettingsFlatSchemaT;
  };
}
