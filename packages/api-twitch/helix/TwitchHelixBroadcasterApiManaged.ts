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
      const redeemM = await super.getCustomPointReward(mappingEntry.twitchRedeemId);
      if (redeemM.isErr()) {
        const createdRedeemM = await super.createCustomPointReward(set);
        if (createdRedeemM.isErr()) {
          return Err(createdRedeemM.unwrapErr());
        }

        // TODO(@Danielduel) update mapping key and return
      }
      const redeem = redeemM.unwrap();

      const updatedRedeemM = await super.updateCustomPointReward(mappingEntry.twitchRedeemId, update);
      if (updatedRedeemM.isErr()) {
        return Err(updatedRedeemM.unwrapErr());
      }

      return Ok(updatedRedeemM.unwrap());
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
