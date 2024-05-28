import { json } from "https://deno.land/x/sift@0.6.0/mod.ts";

export function respondWithMessage(content: string, ephemeral = false) {
  return json({
    // Type 4 responds with the below message retaining the user's
    // input at the top.
    type: 4,
    data: {
      content,
      ephemeral,
    },
  });
}
