import {
  json,
  serve,
  validateRequest,
} from "https://deno.land/x/sift@0.6.0/mod.ts";
import nacl from "https://cdn.skypack.dev/tweetnacl@v1.0.3?dts";
import {
  APIApplicationCommandInteractionDataStringOption,
  APIApplicationCommandInteractionWrapper,
  APIChatInputApplicationCommandInteractionData,
  InteractionType,
} from "https://deno.land/x/discord_api_types@0.37.62/v10.ts";

// For all requests to "/" endpoint, we want to invoke home() handler.
serve({
  "/": home,
});

async function home(request: Request) {
  const { error } = await validateRequest(request, {
    POST: {
      headers: ["X-Signature-Ed25519", "X-Signature-Timestamp"],
    },
  });
  if (error) {
    return json({ error: error.message }, { status: error.status });
  }

  const { valid, body } = await verifySignature(request);
  if (!valid) {
    return json(
      { error: "Invalid request" },
      {
        status: 401,
      },
    );
  }

  const commandEvent = JSON.parse(body);
  if (commandEvent.type === InteractionType.Ping) {
    return json({
      type: 1, // Type 1 in a response is a Pong interaction response type.
    });
  }

  if (commandEvent.type === InteractionType.ApplicationCommand) {
    const response = execute(commandEvent);
    if (response) return response;
  }

  return json({ error: "bad request" }, { status: 400 });
}

/** Verify whether the request is coming from Discord. */
async function verifySignature(
  request: Request,
): Promise<{ valid: boolean; body: string }> {
  const PUBLIC_KEY = Deno.env.get("DISCORD_TOT_APP_PUBLIC_KEY")!;
  // Discord sends these headers with every request.
  const signature = request.headers.get("X-Signature-Ed25519")!;
  const timestamp = request.headers.get("X-Signature-Timestamp")!;
  const body = await request.text();
  const valid = nacl.sign.detached.verify(
    new TextEncoder().encode(timestamp + body),
    hexToUint8Array(signature),
    hexToUint8Array(PUBLIC_KEY),
  );

  return { valid, body };
}

/** Converts a hexadecimal string to Uint8Array. */
function hexToUint8Array(hex: string) {
  return new Uint8Array(
    hex.match(/.{1,2}/g)!.map((val) => parseInt(val, 16)),
  );
}

type CommandHelloInteraction = APIApplicationCommandInteractionWrapper<
  Omit<APIChatInputApplicationCommandInteractionData, "options"> & {
    options: [APIApplicationCommandInteractionDataStringOption];
  }
>;
type CommandPlaylistsInteraction = APIApplicationCommandInteractionWrapper<
  Omit<APIChatInputApplicationCommandInteractionData, "options"> & {
    options: never;
  }
>;

function execute(commandEvent: unknown): Response | undefined {
  if (isCommandOfType(commandEvent, "hello")) {
    return executeHello(commandEvent);
  }

  if (isCommandOfType(commandEvent, "playlists")) {
    return executePlaylists(commandEvent);
  }

  return;
}

type CommandMapping = {
  hello: CommandHelloInteraction;
  playlists: CommandPlaylistsInteraction;
};

function isCommandOfType<T extends keyof CommandMapping>(
  commandEvent: unknown,
  nameOfCommand: T,
): commandEvent is CommandMapping[T] {
  return (
    typeof commandEvent === "object" &&
    !!commandEvent &&
    "data" in commandEvent &&
    !!commandEvent.data &&
    typeof commandEvent.data === "object" &&
    "name" in commandEvent.data && typeof commandEvent.data.name === "string" &&
    commandEvent.data.name === nameOfCommand
  );
}

function executeHello(commandEvent: CommandHelloInteraction) {
  const name = commandEvent.data.options.find((x) => x.name === "name");
  if (!name) return;

  return json({
    // Type 4 responds with the below message retaining the user's
    // input at the top.
    type: 4,
    data: {
      content: `Hello, ${name.value}!`,
    },
  });
}

function executePlaylists(commandEvent: CommandPlaylistsInteraction) {
  return json({
    // Type 4 responds with the below message retaining the user's
    // input at the top.
    type: 4,
    data: {
      content:
        `There is the link to current playlists <https://github.com/Danielduel/tower-of-tech/releases/>!`,
    },
  });
}
