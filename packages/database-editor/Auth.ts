import { collection } from "kvdex/mod.ts";
import { zodModel } from "kvdex/ext/zod.ts";
import { BeatLeaderIntegrationSchema, ToTAccountFlatSchema, ToTAccountSessionSchema } from "@/packages/types/auth.ts";

export const ToTAccount = collection(
  zodModel(ToTAccountFlatSchema),
  {
    history: true,
    indices: {
      id: "primary",
      beatLeaderId: "secondary",
    },
  },
);

export const ToTAccountSession = collection(
  zodModel(ToTAccountSessionSchema),
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
  zodModel(BeatLeaderIntegrationSchema),
  {
    history: true,
    indices: {
      id: "primary",
      parentId: "secondary",
    },
  },
);
