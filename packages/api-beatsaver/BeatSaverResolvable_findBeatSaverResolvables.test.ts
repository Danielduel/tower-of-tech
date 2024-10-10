import { assertEquals } from "@/packages/deps/test.ts";
import { findBeatSaverResolvables } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import {
  lazyBankMessageToId,
  lazyBankMessageToIdWithDiffs,
  lazyBankMessageToIdWithDiffsGenerated,
  tests,
} from "@/packages/api-beatsaver/__mocks/bank.ts";

tests.forEach(([title, param, expected]) => {
  Deno.test(`BeatSaverResolvable.findBeatSaverResolvables ${title}`, () => {
    assertEquals(findBeatSaverResolvables(param), expected as any);
  });
});

lazyBankMessageToIdWithDiffs.forEach(([param, expected, expectedDiffs]) => {
  Deno.test(`BeatSaverResolvable.findBeatSaverResolvables given "${param}" expect "${expected}" with diffs of ${JSON.stringify(expectedDiffs)}`, () => {
    assertEquals(findBeatSaverResolvables(param), {
      raw: param,
      resolvables: [{
        kind: "id",
        data: expected,
        diffs: expectedDiffs,
      }],
    });
  });
});

lazyBankMessageToId.forEach(([param, expected, expectedDiffs]) => {
  Deno.test(`BeatSaverResolvable.findBeatSaverResolvables given "${param}" expect "${expected}"`, () => {
    assertEquals(findBeatSaverResolvables(param), {
      raw: param,
      resolvables: [{
        kind: "id",
        data: expected,
        diffs: expectedDiffs,
      }],
    });
  });
});

lazyBankMessageToIdWithDiffsGenerated.forEach(([param, expected, expectedDiffs]) => {
  Deno.test(`BeatSaverResolvable.findBeatSaverResolvables given "${param}" expect "${expected}" with diffs of ${JSON.stringify(expectedDiffs)}`, () => {
    assertEquals(findBeatSaverResolvables(param), {
      raw: param,
      resolvables: [{
        kind: "id",
        data: expected,
        diffs: expectedDiffs,
      }],
    });
  });
});
