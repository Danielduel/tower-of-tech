import { collection } from "@/packages/deps/kvdex.ts";
import {
  BeatLeaderAuthorizationSchema,
  BeatLeaderIntegrationSchema,
  DiscordAuthorizationSchema,
  DiscordIntegrationSchema,
  ToTAccountFlatSchema,
  ToTAccountSessionSchema,
  TwitchAuthorizationSchema,
  TwitchIntegrationSchema,
} from "@/packages/types/auth.ts";

export const ToTAccount = collection(
  ToTAccountFlatSchema,
  {
    history: true,
    idGenerator: (item) => item.id,
    indices: {
      id: "primary",
      beatLeaderId: "secondary",
      discordId: "secondary",
      twitchId: "secondary",
    },
  },
);

export const ToTAccountSession = collection(
  ToTAccountSessionSchema,
  {
    history: true,
    idGenerator: (item) => item.id,
    indices: {
      id: "primary",
      parentId: "secondary",
    },
  },
);

export const BeatLeaderIntegration = collection(
  BeatLeaderIntegrationSchema,
  {
    history: true,
    idGenerator: (item) => item.id,
    indices: {
      parentId: "secondary",
    },
  },
);

export const BeatLeaderAuthorization = collection(
  BeatLeaderAuthorizationSchema,
  {
    history: true,
    idGenerator: (item) => item.id,
    indices: {
      parentId: "secondary",
    },
  },
);

export const DiscordIntegration = collection(
  DiscordIntegrationSchema,
  {
    history: true,
    idGenerator: (item) => item.id,
    indices: {
      parentId: "secondary",
    },
  },
);

export const DiscordAuthorization = collection(
  DiscordAuthorizationSchema,
  {
    history: true,
    idGenerator: (item) => item.id,
    indices: {
      parentId: "secondary",
    },
  },
);

export const TwitchIntegration = collection(
  TwitchIntegrationSchema,
  {
    history: true,
    idGenerator: (item) => item.id,
    indices: {
      parentId: "secondary",
    },
  },
);

export const TwitchAuthorization = collection(
  TwitchAuthorizationSchema,
  {
    history: true,
    idGenerator: (item) => item.id,
    indices: {
      parentId: "secondary",
    },
  },
);
