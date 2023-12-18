import {
  APIApplicationCommandInteractionWrapper,
  APIChatInputApplicationCommandInteractionData,
} from "https://deno.land/x/discord_api_types@0.37.62/v10.ts";

// export type CommandHelloInteraction = APIApplicationCommandInteractionWrapper<
//   Omit<APIChatInputApplicationCommandInteractionData, "options"> & {
//     options: [APIApplicationCommandInteractionDataStringOption];
//   }
// >;

export type CommandEmptyInteraction =
  APIApplicationCommandInteractionWrapper<
    Omit<APIChatInputApplicationCommandInteractionData, "options"> & {
      options: never;
    }
  >;
