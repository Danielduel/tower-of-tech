import {
  APIApplicationCommandInteractionWrapper,
  APIChatInputApplicationCommandInteractionData,
  APIApplicationCommandInteractionDataStringOption,
} from "https://deno.land/x/discord_api_types@0.37.62/v10.ts";

export type CommandInteraction<Options extends APIApplicationCommandInteractionDataStringOption[]> = APIApplicationCommandInteractionWrapper<
  Omit<APIChatInputApplicationCommandInteractionData, "options"> & {
    options: Options;
  }
>;

export type DefinedStringOption<Name extends string, D> = APIApplicationCommandInteractionDataStringOption & {
  name: Name;
  value: D;
}

export type CommandEmptyInteraction = CommandInteraction<never>;
