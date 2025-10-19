import { TwitchHelixBroadcasterApi } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApi.ts";
import { UserTokenSuccessSchemaT } from "@/packages/api-twitch/helix/common.ts";
import { GetHelixUsersItemSchemaT } from "@/packages/api-twitch/helix/helixUsers.ts";
import { Err, Ok, Result } from "@/packages/utils/optionals.ts";
import { DB } from "@tot/db";
import { keys } from "@tot/db-schema";
import {
  GetHelixChannelPointsCustomRewardsItemSchemaT,
  PatchHelixChannelPointsCustomRewardsBodySchemaT,
  PostHelixChannelPointsCustomRewardsBodySchemaT,
} from "@/packages/api-twitch/helix/helixChannelPointsCustomRewards.ts";

export class TwitchHelixBroadcasterApiManaged extends TwitchHelixBroadcasterApi {
  constructor(
    clientId: string,
    userCreds: UserTokenSuccessSchemaT,
    public override userData: GetHelixUsersItemSchemaT,
  ) {
    super(clientId, userCreds, userData);
  }

  public static override async createFromUserCreds(
    clientId: string,
    userCreds: UserTokenSuccessSchemaT,
  ): Promise<Result<TwitchHelixBroadcasterApiManaged, Error>> {
    const userDataResponseM = await TwitchHelixBroadcasterApiManaged.getUser(
      clientId,
      userCreds,
    );
    if (userDataResponseM.isErr()) {
      return Err(
        Error("User data error TwitchHelixBroadcasterApiManaged.createFromUserCreds", {
          cause: userDataResponseM.unwrapErr(),
        }),
      );
    }
    const userData = userDataResponseM.unwrap();

    if (!userData) return Err("User data unavailable");

    return Ok(
      new TwitchHelixBroadcasterApiManaged(
        clientId,
        userCreds,
        userData,
      ),
    );
  }

  public async getOrUpsertCustomPointReward(
    redeemName: string,
    set: PostHelixChannelPointsCustomRewardsBodySchemaT,
    update: PatchHelixChannelPointsCustomRewardsBodySchemaT,
  ): Promise<Result<GetHelixChannelPointsCustomRewardsItemSchemaT, Error>> {
    const db = await DB.get();
    const mappingEntry = await db.TwitchRedeemMapping
      .find(keys.getTwitchRedeemMappingKey(this.broadcasterId, redeemName))
      .then((x) => x?.flat());

    if (mappingEntry) {
      console.log(`Using mapping entry for ${redeemName}`);
      const redeemListM = await super.getAllCustomPointRewards();
      if (redeemListM.isErr()) {
        console.error(`Can't fetch custom point reward list while get/upsert ${redeemName}`);
        return Err("Can't fetch custom point reward list");
      }
      const redeemList = redeemListM.unwrap();

      const redeem = redeemList.find((x) => {
        return (
          x.id === mappingEntry.twitchRedeemId ||
          x.title === set.title ||
          x.title === update.title
        );
      });

      if (!redeem) {
        console.log(`Missing found redeem for ${redeemName}`);
        const createdRedeemM = await super.createCustomPointReward(set);
        if (createdRedeemM.isErr()) {
          return Err(createdRedeemM.unwrapErr());
        }
        const createdRedeem = createdRedeemM.unwrap();

        db.TwitchRedeemMapping.update(mappingEntry.id, {
          twitchRedeemId: createdRedeem.id,
          name: createdRedeem.title,
        });
        return Ok(createdRedeem);
      }

      const shouldUpdate = redeem.title !== update.title ||
        redeem.cost !== update.cost ||
        redeem.is_paused !== update.is_paused ||
        redeem.prompt !== update.prompt ||
        update.is_enabled !== redeem.is_enabled ||
        update.background_color !== redeem.background_color ||
        update.is_paused !== redeem.is_paused;
      if (shouldUpdate) {
        const updatedRedeemM = await super.updateCustomPointReward(mappingEntry.twitchRedeemId, update);
        if (updatedRedeemM.isErr()) {
          return Err(updatedRedeemM.unwrapErr());
        }

        return Ok(updatedRedeemM.unwrap());
      }
      return Ok(redeem);
    }

    console.log("Creating new point reward");
    const redeemM = await super.createCustomPointReward(set);
    if (redeemM.isErr()) return Err(redeemM.unwrapErr());
    const redeem = redeemM.unwrap();
    const createdMappingEntry = await db.TwitchRedeemMapping.add({
      channelId: this.broadcasterId,
      name: redeemName,
      twitchRedeemId: redeem.id,
      id: keys.getTwitchRedeemMappingKey(this.broadcasterId, redeemName),
    });

    return Ok(redeem);
  }
}
