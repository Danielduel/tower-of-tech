import { Fetcher } from "zod-api";
import { retry } from "@/packages/utils/async.ts";

export const fetcher: Fetcher = (input, init) => {
  return retry(
    async () => {
      if (init?.body && typeof init.body === "string" && init.body.toString().includes("__STRIP_URL_STRING__")) {
        const strip = JSON.parse(init.body);
        delete init.body;
        init.body = new URLSearchParams(strip["__STRIP_URL_STRING__"]);
      }

      const response = await fetch(input, init);
      if (response.status === 404) return response;
      if (!response.ok) {
        console.log(input, init);
        try {
          console.error("Fetch failed", response.status, response.statusText, await response.text());
        } catch (_) {
          console.error("Fetch failed", response.status, response.statusText);
        }
        throw "Retry";
      }
      return response;
    },
    {
      maxAttempts: 90,
      minTimeout: 1000,
      maxTimeout: 60000,
      multiplier: 2,
    },
  );
};
