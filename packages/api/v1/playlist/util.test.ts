import { assert } from "ultra/lib/deps.ts";
import { playlistIdWithFileExtensionToPlaylistId } from "@/packages/api/v1/playlist/util.ts";

Deno.test("playlistIdWithFileExtensionToPlaylistId", async ({ step }) => {
  await step(
    "given '01HK8XCHRH8RDXEEP9F4211NVG' should return '01HK8XCHRH8RDXEEP9F4211NVG'",
    () => {
      assert(
        playlistIdWithFileExtensionToPlaylistId(
          "01HK8XCHRH8RDXEEP9F4211NVG",
        ) === "01HK8XCHRH8RDXEEP9F4211NVG",
      );
    },
  );
  await step(
    "given '01HK8XCHRH8RDXEEP9F4211NVG.json' should return '01HK8XCHRH8RDXEEP9F4211NVG'",
    () => {
      assert(
        playlistIdWithFileExtensionToPlaylistId(
          "01HK8XCHRH8RDXEEP9F4211NVG.json",
        ) === "01HK8XCHRH8RDXEEP9F4211NVG",
      );
    },
  );
  await step(
    "given '01HK8XCHRH8RDXEEP9F4211NVG.bplist' should return '01HK8XCHRH8RDXEEP9F4211NVG'",
    () => {
      assert(
        playlistIdWithFileExtensionToPlaylistId(
          "01HK8XCHRH8RDXEEP9F4211NVG.bplist",
        ) === "01HK8XCHRH8RDXEEP9F4211NVG",
      );
    },
  );
});
