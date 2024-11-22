import { User } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/common.ts";
import { ChannelRole } from "https://deno.land/x/twitch_irc@0.11.2/lib/ratelimit.ts";

function createMockUser(
  defaultString: string,
  role: ChannelRole = ChannelRole.Viewer,
  overrides: Partial<User> = {},
): User {
  return {
    id: defaultString,
    login: defaultString,
    color: defaultString,
    displayName: defaultString,
    role,
    badgeInfo: {},
    badges: {},
    ...overrides,
  };
}

export const userSomething: User = createMockUser("Something");
export const userTest: User = createMockUser("Test");
