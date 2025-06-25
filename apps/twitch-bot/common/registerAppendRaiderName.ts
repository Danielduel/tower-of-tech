import { TwitchPubSubManager } from "@/packages/api-twitch/pubsub/TwitchPubSubManager.ts";
import { TwitchIRCEventContext, TwitchPubSubEvents } from "@/apps/twitch-bot/types.ts";
import { TwitchHelixBroadcasterApiManaged } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApiManaged.ts";

export const registerAppendRaiderName = (
  twitchPubSubManager: TwitchPubSubManager,
  ircContext: TwitchIRCEventContext,
  twitchHelixBroadcasterApiManaged: TwitchHelixBroadcasterApiManaged,
  baseTitle: string,
) => {
  const titleSupplement = " Raiders:";
  const raids: TwitchPubSubEvents["channel_raid"][0]["event"][] = [];
  const maxStreamTitleLength = 140;


  twitchPubSubManager.registerChannelFollowCallback(({ event: follow }) => {
    ircContext.send(`! Thank you for the follow @${follow.user_name}, feel invited to post a follower request!`);
  });
  
  twitchPubSubManager.registerChannelRaidCallback(({ event: raid }) => {
    ircContext.send(`! ${raid.from_broadcaster_user_name} raided the channel with ${raid.viewers} viewers`);
    ircContext.send(`! @${raid.from_broadcaster_user_name} feel invited to post raid request!`);
    if (raid.viewers || true) {
      if (raids.some(x => x.from_broadcaster_user_id === raid.from_broadcaster_user_id)) return;

      raids.push(raid);
      ircContext.send(`! Updating the stream's title`);
      const raiders = raids.sort((a, b) => b.viewers - a.viewers).map((x) =>
        x.from_broadcaster_user_name ?? x.from_broadcaster_user_login
      );
      const raidersInTitle = raiders.map(x => `@${x}`)
      
      let _title = `${baseTitle}${titleSupplement}`;

      for (const raiderInTitle of raidersInTitle) {
        const nextTitle = `${_title} ${raiderInTitle}` 
        if (nextTitle.length < maxStreamTitleLength) {
          _title = nextTitle;
        } else {
          ircContext.send(`! Stream's title got truncated`);
        } 
      }

      twitchHelixBroadcasterApiManaged.setChannelInfo({
        title: _title,
      });
    }
  });
};
