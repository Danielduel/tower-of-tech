import * as TwitchIrc from "https://deno.land/x/twitch_irc@0.11.2/mod.ts";
import { createTrpcClient } from "@/packages/trpc/trpc-editor.ts";

const channel = Deno.env.get("TWITCH_INPERSONATION_CHANNEL")!;
const nick = Deno.env.get("TWITCH_INPERSONATION_LOGIN")!;
const pass = Deno.env.get("TWITCH_INPERSONATION_PASS")!;

const trpc = createTrpcClient(false);
const playlist = await trpc.playlist.getById.query({ id: Deno.env.get("TWITCH_INPERSONATION_PLAYLIST")! });
const beatsaverSongs = await trpc.map.resolve.query({ hashes: playlist?.songs.map((x) => x.hash)! });
const beatsaverKeys = Object.values(beatsaverSongs).map((x) => x.id);

const timeouts: number[] = [];

const client = new TwitchIrc.Client({
  credentials: { nick, pass },
});

const minimumTimings = [
  1000,
  60 * 1000,
  5 * 60 * 1000,
  10 * 60 * 1000,
  7 * 60 * 1000,
];

const sendRandomRequest = (channel: string, removeKeys: string[] = []) => {
  const keysToPickFrom = beatsaverKeys.filter((x) => !removeKeys.includes(x));

  const randomKey = keysToPickFrom[Math.ceil(Math.random() * keysToPickFrom.length)];
  client.privmsg(channel, `!bsr ${randomKey}`);
  return randomKey;
};

const scheduleNextRandomRequest = (channel: string, iteration: number = 0, removeKeys: string[] = []) => {
  const timeConfig = minimumTimings[iteration] ?? minimumTimings[minimumTimings.length] ?? 10 * 60 * 10000;
  const timeVariationMax = timeConfig * 0.3;
  const timeVariation = (timeVariationMax * Math.random() * 2) - timeVariationMax;
  const time = ~~(timeConfig + timeVariation);

  console.log(`Iteration ${iteration} on ${channel} - ${time}`);

  timeouts.push(setTimeout(() => {
    const requestedKey = sendRandomRequest(channel, removeKeys);
    scheduleNextRandomRequest(channel, iteration + 1, [...removeKeys, requestedKey]);
  }, time));
};

client.on("open", () => {
  console.log("Open");
  client.join(channel);
  scheduleNextRandomRequest(channel, 0);
});

client.on("error", (err) => {
  console.error(err);
});

Deno.addSignalListener("SIGINT", () => {
  client.part(channel);
  console.log("\nParted\n\n");
  timeouts.forEach((x) => clearTimeout(x));
  Deno.exit();
});
