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
import {
  Client,
  GatewayIntentBits,
  GuildMember,
  GuildScheduledEventEntityType,
  GuildScheduledEventManager,
  User,
} from "npm:discord.js";

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
    const response = await execute(commandEvent);
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

type CommandBoopTheGeekInteraction = APIApplicationCommandInteractionWrapper<
  Omit<APIChatInputApplicationCommandInteractionData, "options"> & {
    options: never;
  }
>;

async function execute(commandEvent: unknown) {
  if (isCommandOfType(commandEvent, "hello")) {
    return executeHello(commandEvent);
  }

  if (isCommandOfType(commandEvent, "playlists")) {
    return executePlaylists(commandEvent);
  }

  // if (isCommandOfType(commandEvent, "boop-the-geek")) {
  //   return await executeBoopTheGeek(commandEvent);
  // }

  return;
}

type CommandMapping = {
  hello: CommandHelloInteraction;
  playlists: CommandPlaylistsInteraction;
  "boop-the-geek": CommandBoopTheGeekInteraction;
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

// async function executeBoopTheGeek(commandEvent: CommandBoopTheGeekInteraction) {
//   const guildId = "689050370840068309";
//   const userId = "954395586847719505";

//   const client = new Client({ intents: [GatewayIntentBits.GuildMembers] });
//   const guild = await client.guilds.fetch(guildId)
//   const user = await guild.members.fetch(userId);

//   return json({
//     type: 4,
//     data: {
//       content: `Boop ${user.nickname}! They are ${user.moderatable ? "moderatable" : "not moderatable"}`
//     }
//   });
// }

async function executeCreateTechMultiEvent() {
  const guildId = "689050370840068309";

  const client = new Client({ intents: [ GatewayIntentBits.GuildScheduledEvents ] });
  const guild = await client.guilds.fetch(guildId);

  const hourMs = 60 * 60 * 1000;
  const dayMs = 24 * hourMs;
  const weekMs = dayMs * 7;
  const nowMs = Date.now();
  const lastThursday0Ms = nowMs - (nowMs % weekMs);
  const nextThursday0Ms = lastThursday0Ms + 7 * dayMs;
  const timezoneOffset = +(Intl
    .DateTimeFormat(
      [],
      { timeZone: "Europe/Warsaw", timeZoneName: "short" },
    )
    .formatToParts(0)
    .find((part) => part.type === "timeZoneName") ?? { value: "GMT+1" })
    .value
    .split("+")[1];
  const timezonedNextThursday0Ms = nextThursday0Ms + timezoneOffset * hourMs;
  const scheduledStartTime = timezonedNextThursday0Ms + 20 * hourMs;
  const scheduledEndTime = timezonedNextThursday0Ms + 22 * hourMs;
  console.log(new Date(scheduledStartTime));
  console.log(new Date(scheduledEndTime));

  const scheduledEvents = await guild.scheduledEvents.fetch();
  if (scheduledEvents.size !== 0) return;
  guild.scheduledEvents.create({
    entityType: GuildScheduledEventEntityType.External,
    entityMetadata: {
      location: "Multiplayer+",
    },
    name: "Test",
    description: ``,
    scheduledStartTime,
    scheduledEndTime,
    privacyLevel: 2, // guild-only
  });
}

Deno.cron(
  "Reschedule tech multi event",
  "* * * * *",
  executeCreateTechMultiEvent,
);
