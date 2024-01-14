import "https://deno.land/std@0.206.0/dotenv/load.ts";

Deno.env.set("DENO_KV_ACCESS_TOKEN", Deno.env.get("DD_EDITOR_KV_TOKEN")!);

const kv = await Deno.openKv(Deno.env.get("DD_EDITOR_KV_URL"));

const items = kv.list({ prefix: [] });
const promises = [] as Promise<void>[];

for await (const item of items) {
  promises.push(kv.delete(item.key));
}

await Promise.all(promises);
