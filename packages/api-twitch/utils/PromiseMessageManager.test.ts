import { assertEquals, beforeEach, describe, it } from "@/packages/deps/test.ts";
import { PromiseMessageManager } from "@/packages/api-twitch/utils/PromiseMessageManager.ts";
import { userSomething, userTest } from "@/packages/__test__/irc-users/bank.ts";
import { delay } from "@/packages/utils/async.ts";

describe("PromiseMessageManager", () => {
  let manager: PromiseMessageManager = new PromiseMessageManager();

  beforeEach(() => {
    manager = new PromiseMessageManager();
  });

  it("basic happy path", async () => {
    const promise = manager.waitFor((x) => x.sender.displayName === "Test");
    manager.attemptResolve({ message: "Test message", sender: userTest });

    const value = await promise;
    assertEquals(value.unwrap().message, "Test message");
  });

  it("basic happy path longer", async () => {
    const promise = manager.waitFor((x) => x.sender.displayName === "Test");
    await delay(2000);
    manager.attemptResolve({ message: "Test message", sender: userTest });

    const value = await promise;
    assertEquals(value.unwrap().message, "Test message");
  });

  it("basic happy path conversation", async () => {
    const promise = manager.waitFor((x) => x.sender.displayName === "Test");
    await delay(2000);
    manager.attemptResolve({ message: "Test message", sender: userSomething });
    await delay(2000);
    manager.attemptResolve({ message: "Test message", sender: userSomething });
    await delay(2000);
    manager.attemptResolve({ message: "Test message", sender: userSomething });
    await delay(2000);
    manager.attemptResolve({ message: "Test message", sender: userTest });

    const value = await promise;
    assertEquals(value.unwrap().message, "Test message");
  });

  it("timeout unhappy path", async () => {
    const promise = manager.waitFor((x) => x.sender.displayName === "Test");
    manager.attemptResolve({ message: "Test message", sender: userSomething });

    const value = await promise;
    assertEquals(value.isErr(), true);
  });
});
