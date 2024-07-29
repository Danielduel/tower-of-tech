import { assertEquals } from "@/packages/test/deps.ts";
import { getPlaylistFileNameFromPlaylist } from "@/packages/playlist/getPlaylistFileNameFromPlaylist.ts";
import * as mocks from "@/packages/test/mocks/playlists/mod.ts";

Deno.test("getPlaylistFileNameFromPlaylist", async ({ step }) => {
  await step("accsaber raw", () => {
    const result = getPlaylistFileNameFromPlaylist(mocks.rawAccSaber);
    const expect = "AccSaber Overall} Ranked Maps by AccSaber.bplist";
    assertEquals(result, expect);
  });
  await step("beatsaver raw", () => {
    const result = getPlaylistFileNameFromPlaylist(mocks.rawBeatSaver);
    const expect = "EXTREMELY GOOD MAPS by Chrisvenator.bplist";
    assertEquals(result, expect);
  });
  await step("hitbloq raw", () => {
    const result = getPlaylistFileNameFromPlaylist(mocks.rawHitbloq);
    const expect = "Exa's Favorites by unknown.bplist";
    assertEquals(result, expect);
  });
  await step("internal online", () => {
    const result = getPlaylistFileNameFromPlaylist(mocks.internalOnline);
    const expect = "12312312312124124 - test internal playlist by internal user.bplist";
    assertEquals(result, expect);
  });
  await step("internal offline", () => {
    const result = getPlaylistFileNameFromPlaylist(mocks.internalOffline);
    const expect = "12312312312124124 - test internal playlist by internal user.bplist";
    assertEquals(result, expect);
  });
});
