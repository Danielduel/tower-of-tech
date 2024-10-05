import { TwitchIRCEmitter } from "@/apps/twitch-bot/types.ts";
import { getWebsiteUrl, links } from "@/apps/website/routing.config.ts";

export const registerCommands = (irc: TwitchIRCEmitter) => {
  const discordLink = Deno.env.get("TWITCH_IRC_COMMANDS_DISCORD_LINK")!;
  const techMultiLink = Deno.env.get("TWITCH_IRC_COMMANDS_TECHMULTI_LINK");

  irc.on("privmsg", ({ event, context: { send } }) => {
    const msg = event.message.split(" ")[0];
    switch (msg) {
      case "!tot":
        return send(`! @${event.user.displayName} https://www.towerofte.ch`);
      case "!link":
        return send(`! @${event.user.displayName} :eyes:`);
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
        setTimeout(
          () =>
            send(
              `! Asmongold reacts to a person explaining the paper https://www.youtube.com/watch?v=ZYHkc7JAr7w`,
            ),
          1000,
        );
        return;
    }
  });
};
