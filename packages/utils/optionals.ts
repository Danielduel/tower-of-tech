import { Err, Ok, Result } from "https://deno.land/x/optionals@v3.0.0/mod.ts";

export const errP = Promise.resolve(Err(Error()));

export { Err, Ok, Result };
