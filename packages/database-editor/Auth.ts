import { collection } from "@/packages/deps/kvdex.ts";
import {
  BeatLeaderIntegrationSchema,
  DiscordIntegrationSchema,
  ToTAccountFlatSchema,
  ToTAccountSessionSchema,
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
      id: "primary",
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
      id: "primary",
      parentId: "secondary",
    },
  },
);
