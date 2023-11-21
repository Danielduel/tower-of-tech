import "https://deno.land/std@0.206.0/dotenv/load.ts";

const run = Deno.run({
  cmd: ["denoflare", "serve", "websocket-proxy-beatleader"],
  stdout: "piped"
});

const out = await run.status();
console.log(out);
