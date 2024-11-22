import { User } from "https://deno.land/x/twitch_irc@0.11.2/lib/message/common.ts";
import { SECOND_MS } from "@/packages/utils/time.ts";
import { deadline } from "@/packages/utils/async.ts";
import { Err, Ok, Result } from "@/packages/utils/optionals.ts";

type MessageContext = {
  sender: User;
  message: string;
};
type PromiseMessagePredicate = (messageContext: MessageContext, self: PromiseMessage) => boolean;
class PromiseMessage {
  public fallback: MessageContext | null = null;
  public fullfilled: boolean = false;

  constructor(
    public predicate: PromiseMessagePredicate,
    public promise: Promise<MessageContext>,
    public resolve: (value: MessageContext | PromiseLike<MessageContext>) => void,
    public reject: (value: void | PromiseLike<void>) => void,
  ) {}

  static createWaitFor(
    predicate: PromiseMessagePredicate,
    timeout: number = 10 * SECOND_MS,
  ): PromiseMessage {
    const _promise = Promise.withResolvers<MessageContext>();
    const _deadlinedPromise = deadline<MessageContext>(_promise.promise, timeout);
    const promiseMessage = new PromiseMessage(predicate, _deadlinedPromise, _promise.resolve, _promise.reject);
    return promiseMessage;
  }

  async await(): Promise<Result<MessageContext, Error>> {
    const returns = await this.promise
      .then((v) => Ok(v))
      .catch((e) => {
        if (this.fallback !== null) {
          return Ok(this.fallback);
        }
        return Err(e) satisfies Result<MessageContext, Error>;
      });

    this.fullfilled = true;

    return returns;
  }

  attemptResolve(messageContext: MessageContext): boolean {
    if (this.predicate(messageContext, this)) {
      this.resolve(messageContext);
      return true;
    }
    return false;
  }
}
export type PromiseMessageManagerWaitForResult = Promise<Result<MessageContext, Error>>;
export type PromiseMessageManagerWaitForT = (
  predicate: PromiseMessagePredicate,
) => PromiseMessageManagerWaitForResult;
export class PromiseMessageManager {
  private promiseMessages: PromiseMessage[] = [];

  constructor() {}

  waitFor: PromiseMessageManagerWaitForT = (
    predicate,
  ) => {
    const _promiseMessage = PromiseMessage.createWaitFor(predicate);
    this.promiseMessages.push(_promiseMessage);

    return _promiseMessage.await();
  };

  attemptResolve(messageContext: MessageContext) {
    this.promiseMessages.filter((x) => {
      if (x.fullfilled) return false;
      return !x.attemptResolve(messageContext);
    });
  }
}
