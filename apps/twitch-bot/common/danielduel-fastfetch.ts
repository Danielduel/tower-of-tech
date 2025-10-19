import { TwitchHelixBroadcasterApiManaged } from "../../../packages/api-twitch/helix/TwitchHelixBroadcasterApiManaged.ts";
import { TwitchPubSubManager } from "../../../packages/api-twitch/pubsub/TwitchPubSubManager.ts";
import { BeatSaberGameId } from "../../../packages/api-twitch/utils/constants.ts";
import { TwitchIRCEventContext } from "../types.ts";

const symbolsToRemove = [
  "\x1b",
  "[41C",
  "[1G",
  "[18A",
];

export const registerFastfetchCommand = async (
  twitchPubSubManager: TwitchPubSubManager,
  twitchHelixBroadcasterApiManaged: TwitchHelixBroadcasterApiManaged,
  ircContext: TwitchIRCEventContext,
) => {
  const steamWebApiKey = Deno.env.get("STEAM_WEB_API_KEY");
  const steamProfileId = Deno.env.get("STEAM_PROFILE_ID");
  const steamGameId = 620980;

  const commandArgs =
    `--logo none --structure Break:Title:DateTime:Uptime:Separator:BIOS:Bootmgr:OS:Host:Kernel:Board:CPU:GPU:Vulkan:Display:Separator:Shell:Terminal:Editor:Separator:DE:WM:WMTheme:Theme:Icons:Font:Cursor:Separator:Memory:NetIO:CPUUsage:GPUUsage`;

  const command = new Deno.Command("/bin/fastfetch", {
    args: commandArgs.split(" "),
    stdout: "piped",
    env: {
      TERM: "tmux",
    },
  });

  const redeemM = await twitchHelixBroadcasterApiManaged.getOrUpsertCustomPointReward(
    "fastfetchFullRedeem",
    {
      title: "Linux: fastfetch --structure ...",
      cost: 10000,
    },
    {
      title: "Linux: fastfetch --structure ...",
      cost: 10000,
    },
  );

  if (redeemM.isErr()) {
    console.error(redeemM.unwrapErr());
    return;
  }
  const redeem = redeemM.unwrap();

  twitchPubSubManager.registerRewardRedeemedCallback(redeem.id, async ({ event: redemption }) => {
    const process = command.spawn();

    const playedHoursResponse = await fetch(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${steamWebApiKey}&steamid=${steamProfileId}`,
    );
    const stdout = await process.stdout.text();

    let playedHours = "";
    if (playedHoursResponse.ok) {
      const data = await playedHoursResponse.json();
      const entry = Object.values(data.response.games).find((x) => x.appid === steamGameId);
      const normalizeToHours = (x: number) => Math.floor(x / 60 * 100) / 100;
      const forever = normalizeToHours(entry.playtime_forever);
      const foreverLinux = normalizeToHours(entry.playtime_linux_forever);
      const last2Weeks = normalizeToHours(entry.playtime_2weeks);
      playedHours = `${forever}h (${foreverLinux}h on linux, ${last2Weeks}h last 2 weeks)`;
    }

    const lines = stdout
      .split("\n")
      .map((line) => {
        let modifiedLine = line;

        symbolsToRemove.forEach((x) => {
          modifiedLine = modifiedLine.replaceAll(x, "");
        });

        modifiedLine = modifiedLine.replace(/Network\ IO(.*)\:/gm, "Network IO:");

        return modifiedLine;
      });

    ircContext.send("ArchLinux");
    if (playedHours) {
      ircContext.send(`Beat Saber playtime: ${playedHours}`);
    }
    lines.forEach((x) => ircContext.send(x));
  });
};
