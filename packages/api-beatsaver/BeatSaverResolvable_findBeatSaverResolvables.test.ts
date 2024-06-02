import { assertEquals } from "@/packages/test/deps.ts";
import { findBeatSaverResolvables } from "@/packages/api-beatsaver/BeatSaverResolvable.ts";

const lazyBankMessageToId = [
  [
    "! @Danielduel last song :  https://beatsaver.com/maps/1f9a0",
    "1f9a0",
  ],
  [
    "https://beatsaver.com/maps/33525",
    "33525",
  ],
  [
    "! @Danielduel current song :  https://beatsaver.com/maps/2e964",
    "2e964",
  ],
  [
    "! Diastrophism /Zana & Fvrwvrd 66.4% (392af) https://beatsaver.com/maps/392af",
    "392af",
  ],
  [
    "! @Danielduel current song : https://beatsaver.com/maps/241e3",
    "241e3",
  ],
  [
    "https://beatsaver.com/maps/3697a",
    "3697a",
  ],
  [
    "! @Danielduel current song :  https://beatsaver.com/maps/36cbb",
    "36cbb",
  ],
  [
    "https://beatsaver.com/maps/1da0e",
    "1da0e",
  ],
  [
    "https://beatsaver.com/maps/328aa",
    "328aa",
  ],
  [
    "https://beatsaver.com/maps/31d13",
    "31d13",
  ],
  [
    "https://beatsaver.com/maps/3442c",
    "3442c",
  ],
  ["! @Danielduel last song :  https://beatsaver.com/maps/2b4f2", "2b4f2"],
  [
    "! Howl in the Night Sky /Bitz & Joshabi 68.4% (29f79) https://beatsaver.com/maps/29f79",
    "29f79",
  ],
  [
    "! Fractured Angel /abcbadq 71.1% (2a248) https://beatsaver.com/maps/2a248",
    "2a248",
  ],
  [
    "! てねてね / Nachoneko (cover) /Seasonsmouse 79.5% (395a9) https://beatsaver.com/maps/395a9",
    "395a9",
  ],
  [
    "! HUMANBORG /A Jhintleman 80.6% (3948a) https://beatsaver.com/maps/3948a",
    "3948a",
  ],
  [
    "! Papasito (feat. KuTiNa) (Game Edit)/Hener 81.8% (39543) https://beatsaver.com/maps/39543",
    "39543",
  ],
  [
    "! @Danielduel current song : ルナティッククレイジー by Vegetable Mapping Team https://beatsaver.com/maps/38558",
    "38558",
  ],
  [
    "! current song : Scream by Serephor, CMP1111, LaidBackAries https://beatsaver.com/maps/38419",
    "38419",
  ],
  [
    "Oops I dropped this https://beatsaver.com/maps/384d6",
    "384d6",
  ],
  [
    "!bsr 3c92b",
    "3c92b",
  ],
  [
    "! !song @Danielduel current song : https://beatsaver.com/maps/215b8",
    "215b8",
  ],
  [
    "!bsr 2f6a2",
    "2f6a2",
  ],
  [
    "!bsr 149b8",
    "149b8",
  ],
  // [
  //   "(!bsr 27d6c)",
  //   "27d6c"
  // ],
];

const tests = [
  [
    "given empty string, should return emptyish output",
    "",
    {
      raw: "",
      resolvables: [],
    },
  ],
  [
    "given beatsaver.com maps/id url, should return beatsaver url (6 char id)",
    "https://beatsaver.com/maps/3d075a",
    {
      raw: "https://beatsaver.com/maps/3d075a",
      resolvables: [{
        data: "3d075a",
        kind: "id",
      }],
    },
  ],
  [
    "given beatsaver.com maps/id url in a message, should return beatsaver url (6 char id)",
    "! @Danielduel current song :  https://beatsaver.com/maps/3d075a",
    {
      raw: "! @Danielduel current song :  https://beatsaver.com/maps/3d075a",
      resolvables: [{
        data: "3d075a",
        kind: "id",
      }],
    },
  ],
  [
    "given beatsaver.com maps/id, should return beatsaver url (5 char)",
    "https://beatsaver.com/maps/3d075",
    {
      raw: "https://beatsaver.com/maps/3d075",
      resolvables: [{
        data: "3d075",
        kind: "id",
      }],
    },
  ],
  [
    "given beatsaver.com maps/id url in a message, should return beatsaver url (5 char id)",
    "! @Danielduel current song :  https://beatsaver.com/maps/3d075",
    {
      raw: "! @Danielduel current song :  https://beatsaver.com/maps/3d075",
      resolvables: [{
        data: "3d075",
        kind: "id",
      }],
    },
  ],
  [
    "given beatsaver.com maps/id, should return beatsaver url (4 char)",
    "https://beatsaver.com/maps/3d07",
    {
      raw: "https://beatsaver.com/maps/3d07",
      resolvables: [{
        data: "3d07",
        kind: "id",
      }],
    },
  ],
  [
    "given beatsaver.com maps/id url in a message, should return beatsaver url (4 char id)",
    "! @Danielduel current song :  https://beatsaver.com/maps/3d07",
    {
      raw: "! @Danielduel current song :  https://beatsaver.com/maps/3d07",
      resolvables: [{
        data: "3d07",
        kind: "id",
      }],
    },
  ],
  [
    "given beatsaver.com maps/id, should return beatsaver url (3 char)",
    "https://beatsaver.com/maps/3d0",
    {
      raw: "https://beatsaver.com/maps/3d0",
      resolvables: [{
        data: "3d0",
        kind: "id",
      }],
    },
  ],
  [
    "given beatsaver.com maps/id url in a message, should return beatsaver url (3 char id)",
    "! @Danielduel current song :  https://beatsaver.com/maps/3d0",
    {
      raw: "! @Danielduel current song :  https://beatsaver.com/maps/3d0",
      resolvables: [{
        data: "3d0",
        kind: "id",
      }],
    },
  ],
  [
    "given beatsaver.com maps/id, should return beatsaver url (2 char)",
    "https://beatsaver.com/maps/3d",
    {
      raw: "https://beatsaver.com/maps/3d",
      resolvables: [{
        data: "3d",
        kind: "id",
      }],
    },
  ],
  [
    "given beatsaver.com maps/id url in a message, should return beatsaver url (2 char id)",
    "! @Danielduel current song :  https://beatsaver.com/maps/3d",
    {
      raw: "! @Danielduel current song :  https://beatsaver.com/maps/3d",
      resolvables: [{
        data: "3d",
        kind: "id",
      }],
    },
  ],
  [
    "given beatsaver.com maps/id, should return beatsaver url (1 char)",
    "https://beatsaver.com/maps/3",
    {
      raw: "https://beatsaver.com/maps/3",
      resolvables: [{
        data: "3",
        kind: "id",
      }],
    },
  ],
  [
    "given beatsaver.com maps/id url in a message, should return beatsaver url (1 char id)",
    "! @Danielduel current song :  https://beatsaver.com/maps/3",
    {
      raw: "! @Danielduel current song :  https://beatsaver.com/maps/3",
      resolvables: [{
        data: "3",
        kind: "id",
      }],
    },
  ],
  [
    "given beatsaver.com maps/id without an id - should find url, but without pushing invalid resolvable",
    "https://beatsaver.com/maps/",
    {
      raw: "https://beatsaver.com/maps/",
      resolvables: [],
    },
  ],
  [
    "given beatsaver.com maps/id without an id in a message - should find url, but without pushing invalid resolvable",
    "! @Danielduel current song :  https://beatsaver.com/maps/",
    {
      raw: "! @Danielduel current song :  https://beatsaver.com/maps/",
      resolvables: [],
    },
  ],
  [
    "given !bsr a3da0d should treat it as an id resolvable",
    "!bsr a3da0d",
    {
      raw: "!bsr a3da0d",
      resolvables: [{
        kind: "id",
        data: "a3da0d",
      }],
    },
  ],
  [
    "given !bsr a3dz0d should spot an invalid character and not process it further",
    "!bsr a3dz0d",
    {
      raw: "!bsr a3dz0d",
      resolvables: [],
    },
  ],
  [
    "given a3da0d should treat it as an id resolvable",
    "a3da0d",
    {
      raw: "a3da0d",
      resolvables: [{
        kind: "id",
        data: "a3da0d",
      }],
    },
  ],
] as const;

tests.forEach(([title, param, expected]) => {
  Deno.test(`BeatSaverResolvable.findBeatSaverResolvables ${title}`, () => {
    assertEquals(findBeatSaverResolvables(param), expected as any);
  });
});

lazyBankMessageToId.forEach(([param, expected]) => {
  Deno.test(`BeatSaverResolvable.findBeatSaverResolvables given "${param}" expect "${expected}"`, () => {
    assertEquals(findBeatSaverResolvables(param), {
      raw: param,
      resolvables: [{
        kind: "id",
        data: expected,
      }],
    });
  });
});
