// import "https://deno.land/std@0.206.0/dotenv/load.ts";
// import { createPentagon } from "./pentagon.ts";
// import { isLocal, isRemote } from "@/packages/utils/envrionment.ts";

// const kv = isLocal() && !isRemote()
//   ? await Deno.openKv("./local.db")
//   : isRemote()
//     ? await (async () => {
//       Deno.env.set("DENO_KV_ACCESS_TOKEN", Deno.env.get("DD_EDITOR_KV_TOKEN")!);
//       return await Deno.openKv(Deno.env.get("DD_EDITOR_KV_URL"));
//     })()
//     : await Deno.openKv();

// export const dbEditor = createPentagon(kv);
