import { matchBeatSaverResolvable } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";
import { assertEquals } from "../deps/test.ts";
import { makeBeatSaverMapId } from "@/packages/types/beatsaver.ts";
import { makeLowercaseMapHash } from "@/packages/types/brands.ts";

Deno.test("BeatSaverResolvable.matchBeatSaverResolvable", () => {
  const test = matchBeatSaverResolvable({
    onHashResolvable: ({ data }) => `hash ${data}`,
    onIdResolvable: ({ data }) => `id ${data}`,
  });

  assertEquals(test({ kind: "id", data: makeBeatSaverMapId("aaa"), diffs: [] }), "id aaa");
  assertEquals(
    test({ kind: "hash", data: makeLowercaseMapHash("aaa"), diffs: [] }),
    "hash aaa",
  );
});
