import { createBeatleaderWSGeneral } from "@/apps/beatleader-bot/sockets/beatleader-socket-general.ts";

const ws = createBeatleaderWSGeneral();

const historyDir = `./data/beatleader-wss-history/${Date.now()}`;
let autoInc = 0;

const writeHistory = (
  ...data: unknown[]
) => {
  const path = `${historyDir}/${Date.now()}-${++autoInc}`;
  return Deno.writeTextFile(path, JSON.stringify(data));
};

Deno.mkdirSync(historyDir, { recursive: true });

ws.on("accepted", async (...data: unknown[]) => {
  console.log("accepted");
  await writeHistory("accepted", data);
});

ws.on("accepted_errorParse", async (...data: unknown[]) => {
  console.log("accepted_errorParse");
  await writeHistory("accepted_errorParse", data);
  Deno.exit();
});

ws.on("close", async (...data: unknown[]) => {
  console.log("close");
  await writeHistory("close", data);
  Deno.exit();
});

ws.on("error", async (...data: unknown[]) => {
  console.log("error");
  await writeHistory("error", data);
  Deno.exit();
});

ws.on("message_errorParse", async (...data: unknown[]) => {
  console.log("message_errorParse");
  await writeHistory("message_errorParse", data);
  Deno.exit();
});

ws.on("open", async (...data: unknown[]) => {
  console.log("open");
  await writeHistory("open", data);
});

ws.on("rejected", async (...data: unknown[]) => {
  console.log("upload");
  await writeHistory("upload", data);
});

ws.on("upload", async (...data: unknown[]) => {
  console.log("upload");
  await writeHistory("upload", data);
});
