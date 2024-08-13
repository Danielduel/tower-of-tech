import { createBeatleaderWSGeneral } from "@/apps/beatleader-bot/sockets/beatleader-socket-general.ts";

const ws = createBeatleaderWSGeneral({ debug: true });

ws.on("accepted", ({ data }) => {
  console.log(`[Accepted] (${data.country}) ${data.player.name} - (${data.accuracy}) ${data.leaderboard?.song.name}`);
});

ws.on("accepted_errorParse", (data) => console.error("Errors while parsing", data));
