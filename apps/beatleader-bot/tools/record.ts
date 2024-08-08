import { createBeatleaderWSGeneral } from "@/apps/beatleader-bot/sockets/beatleader-socket-general.ts";
import { Err } from "@/apps/beatleader-bot/deps.ts";

const historyDir = `./data/beatleader-wss-history/${Date.now()}`;
let autoIncHistory = 0;
let autoIncLog = 0;
let socketNum = 0;

const writeHistory = (
  ...data: unknown[]
) => {
  const path = `${historyDir}/${Date.now()}-${socketNum}-${++autoIncHistory}`;
  return Deno.writeTextFile(path, JSON.stringify(data));
};

const writeLog = (
  ...data: unknown[]
) => {
  const path = `${historyDir}/${Date.now()}-${socketNum}-${++autoIncLog}`;
  return Deno.writeTextFile(path, JSON.stringify(data));
};

Deno.mkdirSync(historyDir, { recursive: true });

const createBeatleaderWSGeneralRecorder = () =>
  new Promise((resolve) => {
    const ws = createBeatleaderWSGeneral();

    ws.on("accepted", async (...data: unknown[]) => {
      console.log("accepted");
      await writeHistory("accepted", data);
    });

    ws.on("accepted_errorParse", async (...data: unknown[]) => {
      console.log("accepted_errorParse");
      await writeHistory("accepted_errorParse", data);
      resolve(Err("accepted_errorParse"));
    });

    ws.on("close", async (...data: unknown[]) => {
      console.log("close");
      await writeHistory("close", data);
      resolve(Err("Close"));
    });

    ws.on("error", async (...data: unknown[]) => {
      console.log("error");
      await writeHistory("error", data);
      resolve(Err("Error"));
    });

    ws.on("message_errorParse", async (...data: unknown[]) => {
      console.log("message_errorParse");
      await writeHistory("message_errorParse", data);
      resolve(Err("message_errorParse"));
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
  });

// TODO - not sure if restarting it in this way will not leave out polluted scope of the dangling promise/websocket
while (true) {
  try {
    const exitResolved = await createBeatleaderWSGeneralRecorder();
    console.log("Connection reset - resolve");
    writeLog("connection_reset_resolve", exitResolved);
    socketNum++;
  } catch (err) {
    console.log("Connection reset - error");
    writeLog("connection_reset_error", err);
    socketNum++;
  }
}
