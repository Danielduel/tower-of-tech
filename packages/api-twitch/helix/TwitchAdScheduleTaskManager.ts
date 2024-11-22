import { HelixChannelsAdsItemSchemaT } from "@/packages/api-twitch/helix/helixChannelsAds.ts";
import { TwitchHelixBroadcasterApi } from "@/packages/api-twitch/helix/TwitchHelixBroadcasterApi.ts";
import { Err, Ok, Result } from "@/packages/utils/optionals.ts";
import { MINUTE_MS, SECOND_MS } from "@/packages/utils/time.ts";
import { delay } from "@/packages/utils/async.ts";
import { getTimeAgo } from "@/packages/discord/cron/tech-multi/utils.ts";

type Task<R = unknown> = () => R | (() => Promise<R>);
class TimeOffsetTask {
  public currentTimeout: number | null = null;
  public currentDateTarget: Date | null = null;

  constructor(
    public task: Task,
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
    if (this.currentDateTarget) console.log("previous timeout in ", getTimeAgo(this.currentDateTarget));

    const timeoutTime = unoffsettedTime - this.timeOffset;
    const timeoutDate = new Date(Date.now() + timeoutTime);
    this.currentDateTarget = timeoutDate;

    console.log("unoffsettedTime", unoffsettedTime);
    console.log("timeoutTime", timeoutTime);
    console.log("next timeout in ", getTimeAgo(this.currentDateTarget));

    this.currentTimeout = setTimeout(this.task, unoffsettedTime - this.timeOffset);
  };

  public reschedule = (unoffsettedTime: number) => {
    this.clear();
    this.schedule(unoffsettedTime);
  };
}

export class TwitchAdScheduleTaskManager {
  private timeOffsetTasks: TimeOffsetTask[] = [];
  private onAdsEndedTasks: TimeOffsetTask[] = [];

  constructor(
    public currentAdsSchedule: HelixChannelsAdsItemSchemaT,
    private twitchHelixBroadcasterApi: TwitchHelixBroadcasterApi,
  ) {
    this.updateLoop();
  }

  private async updateLoop() {
    while (true) {
      console.warn("Update logs");
      console.warn("Date.now()", Date.now());
      console.warn("this.hasValidSchedule()", this.hasValidSchedule());
      console.warn("this.getNextAdAtTimeIfValid()", this.getNextAdAtTimeIfValid());
      console.warn("this.getNextAdEndTimeIfValid()", this.getNextAdEndTimeIfValid());
      console.warn("this.timeOffsetTasks.length", this.timeOffsetTasks.length);
      console.warn("this.onAdsEndedTasks.length", this.onAdsEndedTasks.length);
      await this.update();
      const delayMs = this.hasValidSchedule() ? 30 * MINUTE_MS : 10 * SECOND_MS;
      await delay(delayMs);
    }
  }

  private hasValidSchedule() {
    const v1 = this.getNextAdAtTimeIfValid();
    const v2 = this.getNextAdEndTimeIfValid();

    return typeof v1 === "number" && typeof v2 === "number";
  }

  public static async fromTwitchHelixBroadcasterApi(
    twitchHelixBroadcasterApi: TwitchHelixBroadcasterApi,
  ): Promise<Result<TwitchAdScheduleTaskManager, Error>> {
    const currentAdsScheduleM = await twitchHelixBroadcasterApi.getChannelAds();

    if (currentAdsScheduleM.isErr()) return Err(currentAdsScheduleM.unwrapErr());
    const currentAdsSchedule = currentAdsScheduleM.unwrap();

    return Ok(new TwitchAdScheduleTaskManager(currentAdsSchedule, twitchHelixBroadcasterApi));
  }

  public getNextAdAtTimeIfValid(now = Date.now()): number | null {
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

  public getNextAdEndTimeIfValid(now = Date.now()): number | null {
    if (this.currentAdsSchedule.next_ad_at) {
      const nextAdEndTime = this.currentAdsSchedule.next_ad_at.getTime() + this.currentAdsSchedule.duration;
      const isInPast = nextAdEndTime < now;
      const isValid = !isInPast;
      if (isValid) {
        return nextAdEndTime;
      }
    }
    return null;
  }

  public pushTimeOffsetTask(task: Task, timeInAdvanceMs: number) {
    const nextAdAtTime = this.getNextAdAtTimeIfValid();
    this.timeOffsetTasks.push(
      new TimeOffsetTask(task, timeInAdvanceMs, nextAdAtTime),
    );
  }

  public pushOnAdsEndedTask(task: Task) {
    this.onAdsEndedTasks.push(new TimeOffsetTask(task, 0, null));
  }

  private rescheduleAllTasks() {
    const nextAdAtTime = this.getNextAdAtTimeIfValid();
    if (typeof nextAdAtTime !== "number") {
      console.error("NextAdAt is invalid");
    } else {
      this.timeOffsetTasks.forEach((x) => {
        x.reschedule(nextAdAtTime);
      });
    }

    const nextAdEndTime = this.getNextAdEndTimeIfValid();
    if (typeof nextAdEndTime !== "number") {
      console.error("NextAdEnd is invalid");
    } else {
      this.onAdsEndedTasks.forEach((x) => {
        x.reschedule(nextAdEndTime);
      });
    }
  }

  private shouldRescheduleTasks(newAdsSchedule: HelixChannelsAdsItemSchemaT): boolean {
    const nextAdAtChanged = newAdsSchedule.next_ad_at?.getTime() !== this.currentAdsSchedule.next_ad_at?.getTime();
    const adDurationChanged = newAdsSchedule.duration !== this.currentAdsSchedule.duration;
    return nextAdAtChanged || adDurationChanged;
  }

  public async update(): Promise<Result<void, Error>> {
    const currentAdsScheduleM = await this.twitchHelixBroadcasterApi.getChannelAds();

    if (currentAdsScheduleM.isErr()) return Err(currentAdsScheduleM.unwrapErr());
    const currentAdsSchedule = currentAdsScheduleM.unwrap();
    const shouldRescheduleTasks = this.shouldRescheduleTasks(currentAdsSchedule);
    this.currentAdsSchedule = currentAdsSchedule;
    console.warn("shouldRescheduleTasks", shouldRescheduleTasks);

    if (shouldRescheduleTasks) {
      this.rescheduleAllTasks();
    }

    return Ok();
  }
}
