import { TwitchHelixBroadcasterApi } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApi.ts";
import { UserTokenSuccessSchemaT } from "@/packages/api-twitch/helix/common.ts";
import { GetHelixUsersItemSchemaT } from "@/packages/api-twitch/helix/helixUsers.ts";
import { Err, Ok, Result } from "@/packages/utils/optionals.ts";
import { dbEditor } from "@/packages/database-editor/mod.ts";
import { getTwitchRedeemMappingKey } from "@/packages/database-editor/keys.ts";
import {
  GetHelixChannelPointsCustomRewardsItemSchemaT,
  PostHelixChannelPointsCustomRewardsBodySchemaT,
} from "@/packages/api-twitch/helix/helixChannelPointsCustomRewards.ts";

export class TwitchHelixBroadcasterApiManaged extends TwitchHelixBroadcasterApi {
  constructor(
    clientId: string,
    userCreds: UserTokenSuccessSchemaT,
    public userData: GetHelixUsersItemSchemaT,
  ) {
    super(clientId, userCreds, userData);
  }

  public static async createFromUserCreds(
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

  public async getOrCreateCustomPointReward(
    redeemName: string,
    defaultBody: PostHelixChannelPointsCustomRewardsBodySchemaT,
  ): Promise<Result<GetHelixChannelPointsCustomRewardsItemSchemaT, Error>> {
    const mappingEntry = await dbEditor.TwitchRedeemMapping
      .find(getTwitchRedeemMappingKey(this.broadcasterId, redeemName))
      .then((x) => x?.flat());

    if (mappingEntry) {
      const redeemM = await super.getCustomPointReward(mappingEntry.twitchRedeemId);
      if (redeemM.isErr()) {
        const createdRedeemM = await super.createCustomPointReward(defaultBody);
        if (createdRedeemM.isErr()) {
          return Err(createdRedeemM.unwrapErr());
        }

        // TODO(@Danielduel) update mapping key and return
      }
      const redeem = redeemM.unwrap();

      return Ok(redeem);
    }

    console.log("Creating new point reward");
    const redeemM = await super.createCustomPointReward(defaultBody);
    if (redeemM.isErr()) return Err(redeemM.unwrapErr());
    const redeem = redeemM.unwrap();
    const createdMappingEntry = await dbEditor.TwitchRedeemMapping.add({
      channelId: this.broadcasterId,
      name: redeemName,
      twitchRedeemId: redeem.id,
      id: getTwitchRedeemMappingKey(this.broadcasterId, redeemName),
    });

    return Ok(redeem);
  }
}
