import { collection } from "@/packages/deps/kvdex.ts";
import {
  ResendLinkTwitchBeatSaverResolvableIdKindSchema,
  ResendLinkTwitchChannelSettingsFlatSchema,
} from "@/packages/types/resendLink.ts";

export const ResendLinkTwitchBeatSaverResolvableIdKind = collection(
  ResendLinkTwitchBeatSaverResolvableIdKindSchema,
  {
    idGenerator: (item) => item.id,
    indices: {
      targetId: "secondary",
      sourceId: "secondary",
    },
  },
);

export const ResendLinkTwitchChannelSettings = collection(
  ResendLinkTwitchChannelSettingsFlatSchema,
  {
    idGenerator: (item) => item.twitchId,
    indices: {
      twitchLogin: "primary",
      parentId: "secondary",
    },
  },
);
