import { collection } from "@/packages/deps/kvdex.ts";
import { BeatLeaderIntegrationSchema, ToTAccountFlatSchema, ToTAccountSessionSchema } from "@/packages/types/auth.ts";

export const ToTAccount = collection(
  ToTAccountFlatSchema,
  {
    history: true,
    idGenerator: (item) => item.id,
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
