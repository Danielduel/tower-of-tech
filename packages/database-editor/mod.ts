/// <reference lib="deno.unstable" />

import "https://deno.land/std@0.206.0/dotenv/load.ts";
import { S3Client } from "s3_lite_client";
import { isDbEditorRemote, isLocal } from "@/packages/utils/envrionment.ts";
import {
  BeatSaberPlaylist,
  BeatSaberPlaylistSongItem,
  BeatSaberPlaylistSongItemMetadata,
} from "@/packages/database-editor/BeatSaberPlaylist.ts";
import {
  BeatSaverIdToHashCache,
  BeatSaverMapResponseSuccess,
  BeatSaverResponseWrapper,
} from "@/packages/database-editor/BeatSaverResponse.ts";
import { DiscordChannel, DiscordGuild } from "@/packages/database-editor/DiscordGuild.ts";
import {
  BeatLeaderAuthorization,
  BeatLeaderIntegration,
  DiscordAuthorization,
  DiscordIntegration,
  ToTAccount,
  ToTAccountSession,
  TwitchAuthorization,
  TwitchIntegration,
} from "@/packages/database-editor/Auth.ts";
import { kvdex } from "@/packages/deps/kvdex.ts";
import { TwitchRedeemMapping, TwitchRedeemMappingSchemaT } from "@/packages/database-editor/TwitchRedeem.ts";
import {
  ResendLinkTwitchBeatSaverResolvableIdKind,
  ResendLinkTwitchChannelSettings,
} from "@/packages/database-editor/ResendLink.ts";
import { BeatSaverIdToHashCacheSchemaT, BeatSaverResponseWrapperSchemaT } from "@/packages/types/beatsaver.ts";
import {
  BeatSaberPlaylistFlatSchemaT,
  BeatSaberPlaylistSongItemMetadataSchemaT,
} from "@/packages/types/beatsaber-playlist.ts";
import { BeatSaberPlaylistSongItemSchemaT } from "@/packages/types/beatsaber-playlist.ts";
import { DiscordChannelSchemaT, DiscordGuildFlatSchemaT } from "@/packages/types/discord-guild.ts";
import {
  BeatLeaderAuthorizationSchemaT,
  BeatLeaderIntegrationSchemaT,
  DiscordAuthorizationSchemaT,
  DiscordIntegrationSchemaT,
  ToTAccountFlatSchemaT,
  ToTAccountSessionSchemaT,
  TwitchAuthorizationSchemaT,
  TwitchIntegrationSchemaT,
} from "@/packages/types/auth.ts";
import {
  ResendLinkTwitchBeatSaverResolvableIdKindSchemaT,
  ResendLinkTwitchChannelSettingsFlatSchemaT,
} from "@/packages/types/resendLink.ts";

export const kv = isDbEditorRemote()
  ? await (async () => {
    Deno.env.set("DENO_KV_ACCESS_TOKEN", Deno.env.get("DD_EDITOR_KV_TOKEN")!);
    return await Deno.openKv(Deno.env.get("DD_EDITOR_KV_URL"));
  })()
  : isLocal()
  ? await Deno.openKv("./local.db")
  : await Deno.openKv();

export const dbEditorSchema = {
  BeatSaverResponseWrapper,
  BeatSaverMapResponseSuccess,
  BeatSaberPlaylist,
  BeatSaberPlaylistSongItemMetadata,
  BeatSaberPlaylistSongItem,
  BeatSaverIdToHashCache,
  DiscordChannel,
  DiscordGuild,
  ToTAccount,
  ToTAccountSession,
  BeatLeaderIntegration,
  BeatLeaderAuthorization,
  DiscordIntegration,
  DiscordAuthorization,
  TwitchRedeemMapping,
  TwitchIntegration,
  TwitchAuthorization,
  ResendLinkTwitchBeatSaverResolvableIdKind,
  ResendLinkTwitchChannelSettings,
};

export const dbEditor = kvdex(kv, dbEditorSchema);

export type DbEditorSchemas = Record<keyof typeof dbEditor, unknown> & {
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
  TwitchRedeemMapping: TwitchRedeemMappingSchemaT;
  ResendLinkTwitchBeatSaverResolvableIdKind: ResendLinkTwitchBeatSaverResolvableIdKindSchemaT;
  ResendLinkTwitchChannelSettings: ResendLinkTwitchChannelSettingsFlatSchemaT;
};

export const s3clientEditor = isLocal() && !isDbEditorRemote()
  ? new S3Client({
    endPoint: "localhost",
    port: 8014,
    useSSL: false,
    region: "dev-region",
    accessKey: "AKEXAMPLES3S",
    secretKey: "SKEXAMPLES3S",
    bucket: "dev-bucket",
    pathStyle: true,
  })
  : new S3Client({
    endPoint: Deno.env.get("S3_URL")!,
    port: 443,
    region: "auto",
    useSSL: true,
    accessKey: Deno.env.get("S3_KEY_ID"),
    secretKey: Deno.env.get("S3_SECRET_ACCESS_KEY"),
    bucket: "dev-bucket",
    pathStyle: true,
  });
