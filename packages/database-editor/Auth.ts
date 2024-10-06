import { collection } from "@/packages/deps/kvdex.ts";
import { BeatLeaderIntegrationSchema, ToTAccountFlatSchema, ToTAccountSessionSchema } from "@/packages/types/auth.ts";

export const ToTAccount = collection(
  ToTAccountFlatSchema,
  {
    history: true,
    indices: {
      id: "primary",
      beatLeaderId: "secondary",
    },
  },
);

export const ToTAccountSession = collection(
  ToTAccountSessionSchema,
  {
    history: true,
    indices: {
      id: "primary",
      oauthSession: "secondary",
      siteSession: "secondary",
      parentId: "secondary",
    },
  },
);

export const BeatLeaderIntegration = collection(
  BeatLeaderIntegrationSchema,
  {
    history: true,
    indices: {
      id: "primary",
      parentId: "secondary",
    },
  },
);
