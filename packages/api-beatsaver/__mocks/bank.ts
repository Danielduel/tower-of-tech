import { BeatSaverMapId, makeBeatSaverMapId } from "@/packages/types/beatsaver.ts";
import { BeatSaberPlaylistSongItemDifficulty } from "@/src/types/BeatSaberPlaylist.d.ts";

const standard = {
  easy: [{ name: "Easy", characteristic: "Standard" }],
  normal: [{ name: "Normal", characteristic: "Standard" }],
  hard: [{ name: "Hard", characteristic: "Standard" }],
  expert: [{ name: "Expert", characteristic: "Standard" }],
  expertPlus: [{ name: "ExpertPlus", characteristic: "Standard" }],
} satisfies Record<string, BeatSaberPlaylistSongItemDifficulty[]>;

const lawless = {
  easy: [{ name: "Easy", characteristic: "Lawless" }],
  normal: [{ name: "Normal", characteristic: "Lawless" }],
  hard: [{ name: "Hard", characteristic: "Lawless" }],
  expert: [{ name: "Expert", characteristic: "Lawless" }],
  expertPlus: [{ name: "ExpertPlus", characteristic: "Lawless" }],
} satisfies Record<string, BeatSaberPlaylistSongItemDifficulty[]>;

export const diffs: [string, BeatSaberPlaylistSongItemDifficulty[]][] = [
  ["e", standard.easy],
  ["E", standard.easy],
  ["es", standard.easy],
  ["ES", standard.easy],
  ["easy", standard.easy],
  ["Easy", standard.easy],
  ["se", standard.easy],
  ["SE", standard.easy],
  ["ses", standard.easy],
  ["SES", standard.easy],
  ["standard easy", standard.easy],
  ["Standard Easy", standard.easy],

  ["n", standard.normal],
  ["N", standard.normal],
  ["normal", standard.normal],
  ["Normal", standard.normal],
  ["sn", standard.normal],
  ["SN", standard.normal],
  ["standard normal", standard.normal],
  ["Standard Normal", standard.normal],

  ["h", standard.hard],
  ["H", standard.hard],
  ["sh", standard.hard],
  ["SH", standard.hard],
  ["standard hard", standard.hard],
  ["Standard Hard", standard.hard],

  ["x", standard.expert],
  ["X", standard.expert],
  ["ex", standard.expert],
  ["EX", standard.expert],
  ["expert", standard.expert],
  ["Expert", standard.expert],
  ["sx", standard.expert],
  ["SX", standard.expert],
  ["standard expert", standard.expert],
  ["Standard Expert", standard.expert],

  ["x+", standard.expertPlus],
  ["X+", standard.expertPlus],
  ["xp", standard.expertPlus],
  ["XP", standard.expertPlus],
  ["exp", standard.expertPlus],
  ["EXP", standard.expertPlus],
  ["ex+", standard.expertPlus],
  ["EX+", standard.expertPlus],
  ["expert plus", standard.expertPlus],
  ["Expert Plus", standard.expertPlus],
  ["sxp", standard.expertPlus],
  ["SXP", standard.expertPlus],
  ["sx+", standard.expertPlus],
  ["SX+", standard.expertPlus],
  ["standard expert plus", standard.expertPlus],
  ["Standard Expert Plus", standard.expertPlus],

  ["le", lawless.easy],
  ["LE", lawless.easy],
  ["les", lawless.easy],
  ["LES", lawless.easy],
  ["lawless easy", lawless.easy],
  ["Lawless Easy", lawless.easy],

  ["ln", lawless.normal],
  ["LN", lawless.normal],
  ["lawless normal", lawless.normal],
  ["Lawless Normal", lawless.normal],

  ["lh", lawless.hard],
  ["LH", lawless.hard],
  ["lawless hard", lawless.hard],
  ["Lawless Hard", lawless.hard],

  ["lx", lawless.expert],
  ["LX", lawless.expert],
  ["lawless expert", lawless.expert],
  ["Lawless Expert", lawless.expert],

  ["lxp", lawless.expertPlus],
  ["LXP", lawless.expertPlus],
  ["lx+", lawless.expertPlus],
  ["LX+", lawless.expertPlus],
  ["lawless expert plus", lawless.expertPlus],
  ["Lawless Expert Plus", lawless.expertPlus],
];

export const lazyBankMessageToIdWithDiffs: [string, BeatSaverMapId, BeatSaberPlaylistSongItemDifficulty[]][] = [
  [
    "https://beatsaver.com/maps/1f9a0 (ex)",
    makeBeatSaverMapId("1f9a0"),
    standard.expert,
  ],
  [
    "!bsr 149b8 [Lawless Expert Plus]",
    makeBeatSaverMapId("149b8"),
    lawless.expertPlus,
  ],
  [
    "!bsr 149b8 Lawless Expert Plus",
    makeBeatSaverMapId("149b8"),
    lawless.expertPlus,
  ],
  [
    "!bsr 149b8 (Lawless Normal)",
    makeBeatSaverMapId("149b8"),
    lawless.normal,
  ],
  [
    "!bsr 149b8 [Lawless Normal]",
    makeBeatSaverMapId("149b8"),
    lawless.normal,
  ],
  [
    "!bsr 149b8 Lawless Normal",
    makeBeatSaverMapId("149b8"),
    lawless.normal,
  ],
  [
    "!bsr 149b8 Standard Normal",
    makeBeatSaverMapId("149b8"),
    standard.normal,
  ],
  [
    "!bsr 149b8 (Standard Normal)",
    makeBeatSaverMapId("149b8"),
    standard.normal,
  ],
  [
    "!bsr 149b8 [Standard Normal]",
    makeBeatSaverMapId("149b8"),
    standard.normal,
  ],
  [
    "!bsr 149b8 Normal",
    makeBeatSaverMapId("149b8"),
    standard.normal,
  ],
  [
    "!bsr 149b8 (Normal)",
    makeBeatSaverMapId("149b8"),
    standard.normal,
  ],
  [
    "!bsr 149b8 [Normal]",
    makeBeatSaverMapId("149b8"),
    standard.normal,
  ],
  [
    "Lawless Expert Plus ! !song @Danielduel current song : https://beatsaver.com/maps/215b8",
    makeBeatSaverMapId("215b8"),
    lawless.expertPlus,
  ],
  [
    "[LX+] ! !song @Danielduel current song : https://beatsaver.com/maps/215b8",
    makeBeatSaverMapId("215b8"),
    lawless.expertPlus,
  ],
  [
    "Standard Expert Plus ! Papasito (feat. KuTiNa) (Game Edit)/Hener 81.8% (39543) https://beatsaver.com/maps/39543",
    makeBeatSaverMapId("39543"),
    standard.expertPlus,
  ],
  [
    "https://beatsaver.com/maps/3ef5b (ex)",
    makeBeatSaverMapId("3ef5b"),
    standard.expert,
  ],
];

export const lazyBankMessageToId: [string, BeatSaverMapId, BeatSaberPlaylistSongItemDifficulty[]][] = [
  [
    "! @Danielduel last song :  https://beatsaver.com/maps/1f9a0",
    makeBeatSaverMapId("1f9a0"),
    [],
  ],
  [
    "https://beatsaver.com/maps/33525",
    makeBeatSaverMapId("33525"),
    [],
  ],
  [
    "! @Danielduel current song :  https://beatsaver.com/maps/2e964",
    makeBeatSaverMapId("2e964"),
    [],
  ],
  [
    "! Diastrophism /Zana & Fvrwvrd 66.4% (392af) https://beatsaver.com/maps/392af",
    makeBeatSaverMapId("392af"),
    [],
  ],
  [
    "! @Danielduel current song : https://beatsaver.com/maps/241e3",
    makeBeatSaverMapId("241e3"),
    [],
  ],
  [
    "https://beatsaver.com/maps/3697a",
    makeBeatSaverMapId("3697a"),
    [],
  ],
  [
    "! @Danielduel current song :  https://beatsaver.com/maps/36cbb",
    makeBeatSaverMapId("36cbb"),
    [],
  ],
  [
    "https://beatsaver.com/maps/1da0e",
    makeBeatSaverMapId("1da0e"),
    [],
  ],
  [
    "https://beatsaver.com/maps/328aa",
    makeBeatSaverMapId("328aa"),
    [],
  ],
  [
    "https://beatsaver.com/maps/31d13",
    makeBeatSaverMapId("31d13"),
    [],
  ],
  [
    "https://beatsaver.com/maps/3442c",
    makeBeatSaverMapId("3442c"),
    [],
  ],
  ["! @Danielduel last song :  https://beatsaver.com/maps/2b4f2", makeBeatSaverMapId("2b4f2"), []],
  [
    "! Howl in the Night Sky /Bitz & Joshabi 68.4% (29f79) https://beatsaver.com/maps/29f79",
    makeBeatSaverMapId("29f79"),
    [],
  ],
  [
    "! Fractured Angel /abcbadq 71.1% (2a248) https://beatsaver.com/maps/2a248",
    makeBeatSaverMapId("2a248"),
    [],
  ],
  [
    "! てねてね / Nachoneko (cover) /Seasonsmouse 79.5% (395a9) https://beatsaver.com/maps/395a9",
    makeBeatSaverMapId("395a9"),
    [],
  ],
  [
    "! HUMANBORG /A Jhintleman 80.6% (3948a) https://beatsaver.com/maps/3948a",
    makeBeatSaverMapId("3948a"),
    [],
  ],
  [
    "! Papasito (feat. KuTiNa) (Game Edit)/Hener 81.8% (39543) https://beatsaver.com/maps/39543",
    makeBeatSaverMapId("39543"),
    [],
  ],
  [
    "! @Danielduel current song : ルナティッククレイジー by Vegetable Mapping Team https://beatsaver.com/maps/38558",
    makeBeatSaverMapId("38558"),
    [],
  ],
  [
    "! current song : Scream by Serephor, CMP1111, LaidBackAries https://beatsaver.com/maps/38419",
    makeBeatSaverMapId("38419"),
    [],
  ],
  [
    "Oops I dropped this https://beatsaver.com/maps/384d6",
    makeBeatSaverMapId("384d6"),
    [],
  ],
  [
    "!bsr 3c92b",
    makeBeatSaverMapId("3c92b"),
    [],
  ],
  [
    "! !song @Danielduel current song : https://beatsaver.com/maps/215b8",
    makeBeatSaverMapId("215b8"),
    [],
  ],
  [
    "!bsr 2f6a2",
    makeBeatSaverMapId("2f6a2"),
    [],
  ],
  [
    "!bsr 149b8",
    makeBeatSaverMapId("149b8"),
    [],
  ],
  // [
  //   "(!bsr 27d6c)",
  //   "27d6c"
  // ],
];

export const lazyBankMessageToIdWithDiffsGenerated: [string, BeatSaverMapId, BeatSaberPlaylistSongItemDifficulty[]][] =
  lazyBankMessageToId.flatMap(([message, expected, _diffs]) => {
    const isCommand = message.startsWith("!bsr") || message.startsWith("bsr") || message.startsWith("sr");
    return diffs
      .flatMap(([difficultyAlias, expectedDiffs]) => {
        return [
          [`${message} ${difficultyAlias}`, expected, expectedDiffs] as [
            string,
            BeatSaverMapId,
            BeatSaberPlaylistSongItemDifficulty[],
          ],
          [`${message} (${difficultyAlias})`, expected, expectedDiffs] as [
            string,
            BeatSaverMapId,
            BeatSaberPlaylistSongItemDifficulty[],
          ],
          [`${message} [${difficultyAlias}]`, expected, expectedDiffs] as [
            string,
            BeatSaverMapId,
            BeatSaberPlaylistSongItemDifficulty[],
          ],
          ...(!isCommand
            ? [[`${difficultyAlias} ${message}`, expected, expectedDiffs] as [
              string,
              BeatSaverMapId,
              BeatSaberPlaylistSongItemDifficulty[],
            ], [`(${difficultyAlias}) ${message}`, expected, expectedDiffs] as [
              string,
              BeatSaverMapId,
              BeatSaberPlaylistSongItemDifficulty[],
            ], [`[${difficultyAlias}] ${message}`, expected, expectedDiffs] as [
              string,
              BeatSaverMapId,
              BeatSaberPlaylistSongItemDifficulty[],
            ]]
            : []),
        ];
      });
  });

export const tests = [
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
        diffs: [],
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
        diffs: [],
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
        diffs: [],
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
        diffs: [],
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
        diffs: [],
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
        diffs: [],
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
        diffs: [],
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
        diffs: [],
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
        diffs: [],
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
        diffs: [],
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
        diffs: [],
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
        diffs: [],
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
        diffs: [],
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
        diffs: [],
      }],
    },
  ],
] as const;
