export const analyticsReadExtensions = "analytics:read:extensions";
export const bitsRead = "bits:read";
export const channelReadAds = "channel:read:ads";
export const channelReadGoals = "channel:read:goals";
export const channelReadGuestStar = "channel:read:guest_star";
export const channelReadRedemptions = "channel:read:redemptions";
export const channelManageAds = "channel:manage:ads";
export const channelManageRedemptions = "channel:manage:redemptions";
export const channelManageBroadcast = "channel:manage:broadcast";
export const channelManageGuestStar = "channel:manage:guest_star";
export const moderatorReadFollowers = "moderator:read:followers";
export const moderatorReadGuestStar = "moderator:read:guest_star";
export const moderatorManageGuestStar = "moderator:manage:guest_star";
export const moderatorManageShoutouts = "moderator:manage:shoutouts";
export const moderatorManageAnnouncements = "moderator:manage:announcements";

export const createScopes = (...scopes: string[]) => scopes.join(" ");
