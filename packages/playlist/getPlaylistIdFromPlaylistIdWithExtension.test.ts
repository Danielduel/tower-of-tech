import { assertEquals } from "@/packages/test/deps.ts";
import { getPlaylistIdFromPlaylistIdWithExtension } from "@/packages/playlist/getPlaylistIdFromPlaylistIdWithExtension.ts";

Deno.test("playlistIdWithFileExtensionToPlaylistId", async ({ step }) => {
  await step(
    "given '01HK8XCHRH8RDXEEP9F4211NVG' should return '01HK8XCHRH8RDXEEP9F4211NVG'",
    () => {
      assertEquals(
        getPlaylistIdFromPlaylistIdWithExtension(
          "01HK8XCHRH8RDXEEP9F4211NVG",
        ),
        "01HK8XCHRH8RDXEEP9F4211NVG",
      );
    },
  );
  await step(
    "given '01HK8XCHRH8RDXEEP9F4211NVG.json' should return '01HK8XCHRH8RDXEEP9F4211NVG'",
    () => {
      assertEquals(
        getPlaylistIdFromPlaylistIdWithExtension(
          "01HK8XCHRH8RDXEEP9F4211NVG.json",
        ),
        "01HK8XCHRH8RDXEEP9F4211NVG",
      );
    },
  );
  await step(
    "given '01HK8XCHRH8RDXEEP9F4211NVG.bplist' should return '01HK8XCHRH8RDXEEP9F4211NVG'",
    () => {
      assertEquals(
        getPlaylistIdFromPlaylistIdWithExtension(
          "01HK8XCHRH8RDXEEP9F4211NVG.bplist",
        ),
        "01HK8XCHRH8RDXEEP9F4211NVG",
      );
    },
  );
});
