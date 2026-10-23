import { describe, expect, it } from "vitest";
import { basePremium, quotePremium } from "./quote.js";

describe("quote premium", () => {
  it("charges only the 5 G processing fee for an empty item list -- 5 G", () => {
    expect(quotePremium([], { yearsWithMHPCO: 0 }, false)).toBe(5);
  });
  it("insures one sword for a newcomer on the first contract -- 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 0 }, false)).toBe(115);
  });
  it("insures one amulet for a newcomer on the first contract -- 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
    expect(quotePremium([{ type: "amulet" }], { yearsWithMHPCO: 0 }, false)).toBe(71);
  });
  it("insures one staff for a newcomer on the first contract -- 80 G base + 8 G first insurance + 5 G fee = 93 G", () => {
    expect(quotePremium([{ type: "staff" }], { yearsWithMHPCO: 0 }, false)).toBe(93);
  });
  it("insures one potion for a newcomer on the first contract -- 40 G base + 4 G first insurance + 5 G fee = 49 G", () => {
    expect(quotePremium([{ type: "potion" }], { yearsWithMHPCO: 0 }, false)).toBe(49);
  });
  it("insures a single rune component -- 25 G base + 2.5 G first insurance + 5 G fee = 32.5 G rounded up to 33 G", () => {
    expect(quotePremium([{ type: "rune" }], { yearsWithMHPCO: 0 }, false)).toBe(33);
  });
  it("insures a single moonstone component -- 25 G base + 2.5 G first insurance + 5 G fee = 32.5 G rounded up to 33 G", () => {
    expect(quotePremium([{ type: "moonstone" }], { yearsWithMHPCO: 0 }, false)).toBe(33);
  });
  it("insures 2 alike runes without a block -- 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("insures exactly 3 alike runes as one building block -- 60 G base premium", () => {
    expect(
      basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(60);
  });
  it("insures 4 alike runes without a block because a block requires exactly 3 -- 100 G base premium", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(100);
  });
  it("insures 7 alike runes without any block -- 175 G base premium", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(basePremium(sevenRunes)).toBe(175);
  });
  it("insures 2 runes and 1 moonstone without a block because the types differ -- 75 G base premium", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]),
    ).toBe(75);
  });
  it("insures 3 runes and 3 moonstones as two separate blocks -- 120 G base premium", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toBe(120);
  });
  it("adds the 50 % cursed surcharge to the cursed sword's own base premium -- 100 G + 50 G + 10 G + 5 G = 165 G", () => {
    expect(
      quotePremium([{ type: "sword", cursed: true }], { yearsWithMHPCO: 0 }, false),
    ).toBe(165);
  });
  it("adds the 30 % high-enchantment surcharge at exactly enchantment 5 -- 100 G + 30 G + 10 G + 5 G = 145 G", () => {
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 5 }],
        { yearsWithMHPCO: 0 },
        false,
      ),
    ).toBe(145);
  });
  it("adds no high-enchantment surcharge at enchantment 4 -- 100 G + 10 G + 5 G = 115 G", () => {
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 4 }],
        { yearsWithMHPCO: 0 },
        false,
      ),
    ).toBe(115);
  });
  it("adds only the curse surcharge to a cursed sword with enchantment 4 -- 100 G + 50 G + 10 G + 5 G = 165 G", () => {
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 4, cursed: true }],
        { yearsWithMHPCO: 0 },
        false,
      ),
    ).toBe(165);
  });
  it("adds both curse and high-enchantment surcharges to a cursed sword with enchantment 5 -- 100 G + 50 G + 30 G + 10 G + 5 G = 195 G", () => {
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 5, cursed: true }],
        { yearsWithMHPCO: 0 },
        false,
      ),
    ).toBe(195);
  });
  it("grants the 20 % loyalty discount at exactly 2 years with MHPCO -- 100 G - 20 G + 10 G + 5 G = 95 G", () => {
    expect(
      quotePremium([{ type: "sword" }], { yearsWithMHPCO: 2 }, false),
    ).toBe(95);
  });
  it("grants no loyalty discount at 1 year with MHPCO -- 100 G + 10 G + 5 G = 115 G", () => {
    expect(
      quotePremium([{ type: "sword" }], { yearsWithMHPCO: 1 }, false),
    ).toBe(115);
  });
  it("grants no follow-up contract discount on the scenario's first quote for a 3-year customer -- 100 G + 50 G + 30 G - 20 G + 10 G + 5 G = 175 G", () => {
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 3 },
        false,
      ),
    ).toBe(175);
  });
  it("applies the follow-up contract discount on the scenario's second quote for a 3-year customer -- 100 G + 50 G + 30 G - 20 G + 10 G - 15 G + 5 G = 160 G", () => {
    expect(
      quotePremium(
        [{ type: "sword", enchantment: 7, cursed: true }],
        { yearsWithMHPCO: 3 },
        true,
      ),
    ).toBe(160);
  });
  it("applies the curse surcharge to the affected item only, not to the policy base premium -- cursed sword 100 G + plain amulet 60 G = 160 G base, + 50 G curse, + 16 G first insurance on the base, + 5 G fee = 231 G", () => {
    expect(
      quotePremium(
        [{ type: "sword", cursed: true }, { type: "amulet" }],
        { yearsWithMHPCO: 0 },
        false,
      ),
    ).toBe(231);
  });
  it("sums item base premiums before policy-wide modifiers -- sword 100 G + 3-rune block 60 G = 160 G base, + 16 G first insurance, + 5 G fee = 181 G", () => {
    expect(
      quotePremium(
        [
          { type: "sword" },
          { type: "rune" },
          { type: "rune" },
          { type: "rune" },
        ],
        { yearsWithMHPCO: 0 },
        false,
      ),
    ).toBe(181);
  });
  it("insures two swords of the same type -- 2 x 100 G base + 20 G first insurance + 5 G fee = 225 G", () => {
    expect(
      quotePremium(
        [{ type: "sword" }, { type: "sword" }],
        { yearsWithMHPCO: 0 },
        false,
      ),
    ).toBe(225);
  });
  it("rounds the final premium up in the MHPCO's favor -- 175 G base + 17.5 G first insurance + 5 G fee = 197.5 G becomes 198 G", () => {
    const sevenRunes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quotePremium(sevenRunes, { yearsWithMHPCO: 0 }, false)).toBe(198);
  });
});
