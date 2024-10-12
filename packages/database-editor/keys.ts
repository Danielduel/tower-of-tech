import { PlaylistId, UppercaseMapHash } from "@/packages/types/brands.ts";
import {
  BroadcasterId,
  makeTwitchRedeemMappingKeyId,
  TwitchRedeemMappingKeyId,
} from "@/packages/api-twitch/helix/brand.ts";

export const getBeatSaberPlaylistSongItemMetadataKey = (playlistId: PlaylistId, mapHash: UppercaseMapHash) =>
  `${playlistId}-${mapHash}`;

export const getTwitchRedeemMappingKey = (channelId: BroadcasterId, name: string): TwitchRedeemMappingKeyId =>
  makeTwitchRedeemMappingKeyId(`${channelId}-${name}`);
