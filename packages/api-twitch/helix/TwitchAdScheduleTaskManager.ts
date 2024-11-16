import { HelixChannelsAdsItemSchemaT } from "@/packages/api-twitch/helix/helixChannelsAds.ts";
import { TwitchHelixBroadcasterApi } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApi.ts";
import { Err, Ok, Result } from "@/packages/utils/optionals.ts";

class TimeOffsetTask {
  public currentTimeout: number | null = null;

  constructor(
    public task: () => void | (() => Promise<void>),
    public timeOffset: number,
    unoffsettedTime?: number | null,
  ) {
    if (typeof unoffsettedTime === "number") {
      this.reschedule(unoffsettedTime);
    }
  }

  private clear = () => {
    if (typeof this.currentTimeout === "number") {
      clearTimeout(this.currentTimeout);
      this.currentTimeout = null;
    }
  };

  private schedule = (unoffsettedTime: number) => {
    this.currentTimeout = setTimeout(this.task, unoffsettedTime - this.timeOffset);
  };

  public reschedule = (unoffsettedTime: number) => {
    this.clear();
    this.schedule(unoffsettedTime);
  };
}

export class TwitchAdScheduleTaskManager {
  private timeOffsetTasks: TimeOffsetTask[] = [];

  constructor(
    public currentAdsSchedule: HelixChannelsAdsItemSchemaT,
    private twitchHelixBroadcasterApi: TwitchHelixBroadcasterApi,
  ) {}

  public static async fromTwitchHelixBroadcasterApi(
    twitchHelixBroadcasterApi: TwitchHelixBroadcasterApi,
  ): Promise<Result<TwitchAdScheduleTaskManager, Error>> {
    const currentAdsScheduleM = await twitchHelixBroadcasterApi.getChannelAds();

    if (currentAdsScheduleM.isErr()) return Err(currentAdsScheduleM.unwrapErr());
    const currentAdsSchedule = currentAdsScheduleM.unwrap();

    return Ok(new TwitchAdScheduleTaskManager(currentAdsSchedule, twitchHelixBroadcasterApi));
  }

  private getNextAdAtTimeIfValid(now = Date.now()): number | null {
    if (this.currentAdsSchedule.next_ad_at) {
      const nextAdAtTime = this.currentAdsSchedule.next_ad_at.getTime();
      const isInPast = nextAdAtTime < now;
      const isValid = !isInPast;
      if (isValid) {
        return nextAdAtTime;
      }
    }
    return null;
  }

  public pushTimeOffsetTask(fn: typeof TimeOffsetTask["prototype"]["task"], timeInAdvanceMs: number) {
    const nextAdAtTime = this.getNextAdAtTimeIfValid();
    this.timeOffsetTasks.push(
      new TimeOffsetTask(fn, timeInAdvanceMs, nextAdAtTime),
    );
  }

  private rescheduleAllTasks() {
    const nextAdAtTime = this.getNextAdAtTimeIfValid();
    if (typeof nextAdAtTime !== "number") {
      console.error("NextAdAt is invalid");
      return;
    }
    this.timeOffsetTasks.forEach((x) => {
      x.reschedule(nextAdAtTime);
    });
  }

  private shouldRescheduleTasks(newAdsSchedule: HelixChannelsAdsItemSchemaT): boolean {
    return newAdsSchedule.next_ad_at !== this.currentAdsSchedule.next_ad_at;
  }

  public async update(): Promise<Result<void, Error>> {
    const currentAdsScheduleM = await this.twitchHelixBroadcasterApi.getChannelAds();

    if (currentAdsScheduleM.isErr()) return Err(currentAdsScheduleM.unwrapErr());
    const currentAdsSchedule = currentAdsScheduleM.unwrap();
    const shouldRescheduleTasks = this.shouldRescheduleTasks(currentAdsSchedule);
    this.currentAdsSchedule = currentAdsSchedule;

    if (shouldRescheduleTasks) {
      this.rescheduleAllTasks();
    }

    return Ok();
  }
}
