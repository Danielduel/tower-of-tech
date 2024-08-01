const historyDir = `./data/beatleader-wss-history/${Date.now()}`;
const writeHistory = (
  ...data: unknown[]
) => Deno.writeTextFile(`${historyDir}/${Date.now()}`, JSON.stringify(data));
Deno.mkdirSync(historyDir, { recursive: true });

const addr = "wss://sockets.api.beatleader.xyz/general";
const ws = new WebSocket(addr);

ws.onopen = async (...data: unknown[]) => {
  console.log("Opened");
  await writeHistory(data);
};

ws.onerror = async (...data: unknown[]) => {
  console.log("Error");
  await writeHistory(data);
  Deno.exit();
};

ws.onclose = async (...data: unknown[]) => {
  console.log("Close");
  await writeHistory(data);
  Deno.exit();
};

ws.onmessage = async (...data: unknown[]) => {
  console.log("Message");
  await writeHistory(data);
};
