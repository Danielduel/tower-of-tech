import { BeatSaberPlaylistSongItemDifficulty } from "@/src/types/BeatSaberPlaylist.d.ts";

function escapeRegExp(raw: string) {
  return raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

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

const buildMatchers = (key: string, skipEscape = false) => {
  const escapedKey = skipEscape ? key : escapeRegExp(key);
  return [
    new RegExp(` ${escapedKey}$`),
    new RegExp(`\\(${escapedKey}\\)$`),
    new RegExp(`\\[${escapedKey}\\]$`),
  ];
};

const negativeLookbehindStandardLower = `(?<!lawless)`;
const negativeLookbehindStandardUpper = `(?<!Lawless)`;

export const difficultyMapping = {
  easyStandard: {
    result: standard.easy,
    matchers: [
      ...buildMatchers("e"),
      ...buildMatchers("E"),
      ...buildMatchers("es"),
      ...buildMatchers("ES"),
      ...buildMatchers(`${negativeLookbehindStandardLower} easy`, true),
      ...buildMatchers(`${negativeLookbehindStandardUpper} Easy`, true),
      ...buildMatchers("se"),
      ...buildMatchers("SE"),
      ...buildMatchers("ses"),
      ...buildMatchers("SES"),
      ...buildMatchers("standard easy"),
      ...buildMatchers("Standard Easy"),
    ],
  },

  normalStandard: {
    result: standard.normal,
    matchers: [
      ...buildMatchers("n"),
      ...buildMatchers("N"),
      ...buildMatchers(`${negativeLookbehindStandardLower} ${escapeRegExp("normal")}`, true),
      ...buildMatchers(`${negativeLookbehindStandardUpper} ${escapeRegExp("Normal")}`, true),
      ...buildMatchers("sn"),
      ...buildMatchers("SN"),
      ...buildMatchers("standard normal"),
      ...buildMatchers("Standard Normal"),
    ],
  },

  hardStandard: {
    result: standard.hard,
    matchers: [
      ...buildMatchers("h"),
      ...buildMatchers("H"),
      ...buildMatchers(`${negativeLookbehindStandardLower} hard`, true),
      ...buildMatchers(`${negativeLookbehindStandardUpper} Hard`, true),
      ...buildMatchers("sh"),
      ...buildMatchers("SH"),
      ...buildMatchers("standard hard"),
      ...buildMatchers("Standard Hard"),
    ],
  },

  expertStandard: {
    result: standard.expert,
    matchers: [
      ...buildMatchers("x"),
      ...buildMatchers("X"),
      ...buildMatchers("ex"),
      ...buildMatchers("EX"),
      ...buildMatchers(`${negativeLookbehindStandardLower} expert`, true),
      ...buildMatchers(`${negativeLookbehindStandardUpper} Expert`, true),
      ...buildMatchers("sx"),
      ...buildMatchers("SX"),
      ...buildMatchers("standard expert"),
      ...buildMatchers("Standard Expert"),
    ],
  },

  expertPlusStandard: {
    result: standard.expertPlus,
    matchers: [
      ...buildMatchers("x+"),
      ...buildMatchers("X+"),
      ...buildMatchers("xp"),
      ...buildMatchers("XP"),
      ...buildMatchers("exp"),
      ...buildMatchers("EXP"),
      ...buildMatchers("ex+"),
      ...buildMatchers("EX+"),
      ...buildMatchers(`${negativeLookbehindStandardLower} expert plus`, true),
      ...buildMatchers(`${negativeLookbehindStandardUpper} Expert Plus`, true),
      ...buildMatchers("sxp"),
      ...buildMatchers("SXP"),
      ...buildMatchers("sx+"),
      ...buildMatchers("SX+"),
      ...buildMatchers("standard expert plus"),
      ...buildMatchers("Standard Expert Plus"),
    ],
  },

  easyLawless: {
    result: lawless.easy,
    matchers: [
      ...buildMatchers("le"),
      ...buildMatchers("LE"),
      ...buildMatchers("les"),
      ...buildMatchers("LES"),
      ...buildMatchers("lawless easy"),
      ...buildMatchers("Lawless Easy"),
    ],
  },

  normalLawless: {
    result: lawless.normal,
    matchers: [
      ...buildMatchers("ln"),
      ...buildMatchers("LN"),
      ...buildMatchers("lawless normal"),
      ...buildMatchers("Lawless Normal"),
    ],
  },

  hardLawless: {
    result: lawless.hard,
    matchers: [
      ...buildMatchers("lh"),
      ...buildMatchers("LH"),
      ...buildMatchers("lawless hard"),
      ...buildMatchers("Lawless Hard"),
    ],
  },

  expertLawless: {
    result: lawless.expert,
    matchers: [
      ...buildMatchers("lx"),
      ...buildMatchers("LX"),
      ...buildMatchers("lawless expert"),
      ...buildMatchers("Lawless Expert"),
    ],
  },

  expertPlusLawless: {
    result: lawless.expertPlus,
    matchers: [
      ...buildMatchers("lxp"),
      ...buildMatchers("LXP"),
      ...buildMatchers("lx+"),
      ...buildMatchers("LX+"),
      ...buildMatchers("lawless expert plus"),
      ...buildMatchers("Lawless Expert Plus"),
    ],
  },
};

export const difficultyMappingKeys = Object.keys(difficultyMapping) as (keyof typeof difficultyMapping)[];
