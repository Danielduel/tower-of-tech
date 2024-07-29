import { Brand, make } from "https://deno.land/x/ts_brand@0.0.1/mod.ts";

export type UppercaseMapHashForLevelId = Brand<
  string,
  "UppercaseMapHashForLevelId"
>;
export const makeUppercaseMapHashForLevelId = (hash: string) => make<UppercaseMapHashForLevelId>()(hash.toUpperCase());

export type UppercaseMapHash = Brand<string, "UppercaseMapHash">;
export const makeUppercaseMapHash = (hash: string) => make<UppercaseMapHash>()(hash.toUpperCase());

export type LowercaseMapHash = Brand<string, "LowercaseMapHash">;
export const makeLowercaseMapHash = (hash: string) => make<LowercaseMapHash>()(hash.toLowerCase());

export type ImageUrl = Brand<string, "ImageUrl">;
export const makeImageUrl = make<ImageUrl>();

export type PlaylistUrl = Brand<string, "PlaylistUrl">;
export const makePlaylistUrl = make<PlaylistUrl>();

export type PlaylistId = Brand<string, "PlaylistId">;
export const makePlaylistId = make<PlaylistId>();

export type MapdataUrl = Brand<string, "MapdataUrl">;
export const makeMapdataUrl = make<MapdataUrl>();

export type PreviewUrl = Brand<string, "PreviewUrl">;
export const makePreviewUrl = make<PreviewUrl>();

export type DateString = Brand<string, "DateString">;
export const makeDateString = make<DateString>();

export type ImageBase64 = Brand<string, "ImageBase64">;
export const makeImageBase64 = make<ImageBase64>();
