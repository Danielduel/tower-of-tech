import { DB } from "@/packages/db/mod.ts";

const record: Record<string, number> = {};

const db = await DB.get();

await db.ResendLinkTwitchBeatSaverResolvableIdKind.forEach((x) => {
  const item = x.value;
  const { targetLogin } = item;
  if (record[targetLogin]) {
    record[targetLogin]++;
    return;
  }
  record[targetLogin] = 1;
});

console.log("Listing");
Object.entries(record).forEach(([name, count]) => {
  console.log(`${name}: ${count}`);
});
