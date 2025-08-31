import { TwitchIRCEmitter } from "@/apps/twitch-bot/types.ts";
import { getWebsiteUrl, links } from "@/apps/website-old/routing.config.ts";
import { TwitchHelixBroadcasterApi } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApi.ts";
import { ChannelRole } from "https://deno.land/x/twitch_irc@0.11.2/mod.ts";

export const registerCommands = (irc: TwitchIRCEmitter, twitchHelixBroadcasterApi: TwitchHelixBroadcasterApi) => {
  const discordLink = Deno.env.get("TWITCH_IRC_COMMANDS_DISCORD_LINK")!;
  const techMultiLink = Deno.env.get("TWITCH_IRC_COMMANDS_TECHMULTI_LINK");

  irc.on("privmsg", async ({ event, context: { send } }) => {
    const [cmd, ...args] = event.message.split(" ");

    switch (cmd) {
      case "!so": {
        const isModeratorOrAbove = event.user.role === ChannelRole.Streamer ||
          event.user.role === ChannelRole.Moderator;
        if (!isModeratorOrAbove) {
          console.log(`Rejected !so command for ${event.user.displayName} (role ${event.user.role})`);
          return;
        }
        const _user = args[0];
        if (!_user) return;
        const user = _user.split("@").join("");
        if (!user) return;
        const twitchUserDataM = await twitchHelixBroadcasterApi.getBroadcasterByName(user);
        if (twitchUserDataM.isErr()) {
          console.error(twitchUserDataM.unwrapErr());
          return send(`! I've tried to look for ${user} but I failed :C CODE 110`);
        }
        const twitchUserData = twitchUserDataM.unwrap();
        const { id, display_name, broadcaster_login, game_name } = twitchUserData;
        twitchHelixBroadcasterApi.postChatShoutout(id);
        if (game_name) {
          return send(
            `! Shoutout for ${display_name}, last streamed ${game_name} https://twitch.tv/${broadcaster_login}`,
          );
        } else {
          return send(
            `! Shoutout for ${display_name} https://twitch.tv/${broadcaster_login}`,
          );
        }
      }
      case "!tot":
        return send(`! @${event.user.displayName} https://www.towerofte.ch`);
      case "!dc":
      case "!discord":
        return send(`! @${event.user.displayName} ${discordLink}`);
      case "!maphelp":
        return send(`! @${event.user.displayName} Mapping help ${getWebsiteUrl(links.home.techMappers)}`);
      case "!techmulti":
        return send(`! @${event.user.displayName} ${techMultiLink}`);
      case "!eu":
        setTimeout(() => send(`! Petition https://eci.ec.europa.eu/045/public/#/screen/home`), 10);
        setTimeout(() => send(`! Webpage https://www.stopkillinggames.com/eci`), 500);
        return;
    }
  });
};
