import { retry } from "https://deno.land/std@0.177.0/async/retry.ts";
import { Fetcher } from "https://deno.land/x/zod_api@v0.3.1/src/types.ts";

export const fetcher: Fetcher = (input, init) => {
  return retry(
    async () => {
      const response = await fetch(input, init);
      if (response.status === 404) return response;
      if (!response.ok) throw "Retry";
      return response;
    },
    {
      maxAttempts: 90,
      minTimeout: 1000,
      maxTimeout: 60000,
      multiplier: 2,
    }
  );
};
