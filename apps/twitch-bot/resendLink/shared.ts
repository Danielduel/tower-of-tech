import { ResendLinkChannelManager } from "@/apps/twitch-bot/resendLink/ResendLinkChannelManager.ts";
import { getAuthAppToken } from "@/packages/api-twitch/getAuthAppToken.ts";

export const manager = new ResendLinkChannelManager();

const appAuthM = await getAuthAppToken();

if (appAuthM.isErr()) throw appAuthM.unwrapErr();

export const appAuth = appAuthM.unwrap();
