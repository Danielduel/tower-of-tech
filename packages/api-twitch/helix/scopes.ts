export const analyticsReadExtensions = "analytics:read:extensions";
export const channelReadAds = "channel:read:ads";
export const channelManageAds = "channel:manage:ads";
export const channelReadRedemptions = "channel:read:redemptions";
export const channelManageRedemptions = "channel:manage:redemptions";
export const channelManageBroadcast = "channel:manage:broadcast";
export const moderatorManageShoutouts = "moderator:manage:shoutouts";
export const moderatorManageAnnouncements = "moderator:manage:announcements";

export const createScopes = (...scopes: string[]) => scopes.join(" ");
