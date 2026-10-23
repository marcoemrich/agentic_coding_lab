import { describe, expect, it } from "vitest";
import { catalogEntry } from "./catalog.js";
import { policyBasePremium, quotePremium } from "./pricing.js";

describe("MHPCO price list", () => {
  it("insures a sword at 1000 G value with 100 G base premium", () => {
    expect(catalogEntry("sword")).toEqual({ value: 1000, premium: 100 });
  });
  it("insures an amulet at 600 G value with 60 G base premium", () => {
    expect(catalogEntry("amulet")).toEqual({ value: 600, premium: 60 });
  });
  it("insures a staff at 800 G value with 80 G base premium", () => {
    expect(catalogEntry("staff")).toEqual({ value: 800, premium: 80 });
  });
  it("insures a potion at 400 G value with 40 G base premium", () => {
    expect(catalogEntry("potion")).toEqual({ value: 400, premium: 40 });
  });
  it("insures a rune at 250 G value with 25 G base premium", () => {
    expect(catalogEntry("rune")).toEqual({ value: 250, premium: 25 });
  });
  it("insures a moonstone at 250 G value with 25 G base premium", () => {
    expect(catalogEntry("moonstone")).toEqual({ value: 250, premium: 25 });
  });
});

describe("building blocks of alike components", () => {
  it("charges 50 G base premium for 2 runes", () => {
    expect(policyBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("charges 60 G base premium for 3 runes (block applies)", () => {
    expect(
      policyBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }]),
    ).toBe(60);
  });
  it("charges 100 G base premium for 4 runes (no block: block requires exactly 3)", () => {
    expect(
      policyBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(100);
  });
  it("charges 175 G base premium for 7 runes", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(policyBasePremium(runes)).toBe(175);
  });
  it("charges 75 G base premium for 2 runes + 1 moonstone (no block: different types)", () => {
    expect(
      policyBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
      ]),
    ).toBe(75);
  });
  it("charges 120 G base premium for 3 runes + 3 moonstones (two separate blocks)", () => {
    expect(
      policyBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "moonstone" },
        { type: "moonstone" },
        { type: "moonstone" },
      ]),
    ).toBe(120);
  });
});

describe("quote premium", () => {
  it("charges 5 G for an empty item list (only the processing fee)", () => {
    expect(quotePremium([], { yearsWithMHPCO: 0 })).toBe(5);
  });
  it("charges 115 G for a plain sword of a 0-year customer (100 base + 10 first insurance + 5 fee)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 0 })).toBe(115);
  });
  it("charges 165 G for a newcomer's cursed sword (100 + 50 curse + 10 first insurance + 5 fee)", () => {
    expect(
      quotePremium([{ type: "sword", cursed: true }], { yearsWithMHPCO: 0 }),
    ).toBe(165);
  });
  it("applies the 30 % high-enchantment surcharge at exactly enchantment 5 -> 145 G", () => {
    expect(
      quotePremium([{ type: "sword", enchantment: 5 }], { yearsWithMHPCO: 0 }),
    ).toBe(145);
  });
  it("applies no high-enchantment surcharge at enchantment 4 -> 115 G", () => {
    expect(
      quotePremium([{ type: "sword", enchantment: 4 }], { yearsWithMHPCO: 0 }),
    ).toBe(115);
  });
  it("applies curse and high-enchantment surcharges together on one item -> 195 G", () => {
    expect(
      quotePremium(
        [{ type: "sword", cursed: true, enchantment: 5 }],
        { yearsWithMHPCO: 0 },
      ),
    ).toBe(195);
  });
  it("applies the 20 % loyalty discount at exactly 2 years with MHPCO -> 95 G", () => {
    expect(
      quotePremium([{ type: "sword" }], { yearsWithMHPCO: 2 }),
    ).toBe(95);
  });
  it("applies no loyalty discount at 1 year with MHPCO -> 115 G", () => {
    expect(
      quotePremium([{ type: "sword" }], { yearsWithMHPCO: 1 }),
    ).toBe(115);
  });
  it("applies the cursed surcharge only to the cursed item's base premium: cursed sword + plain amulet for a 0-year customer -> 231 G (50 G surcharge, not 80 G)", () => {
    expect(
      quotePremium(
        [{ type: "sword", cursed: true }, { type: "amulet" }],
        { yearsWithMHPCO: 0 },
      ),
    ).toBe(231);
  });
  it("charges 160 G for a long-standing customer's second contract with a cursed enchantment-7 sword (100 + 50 + 30 - 20 + 10 - 15 + 5)", () => {
    expect(
      quotePremium(
        [{ type: "sword", cursed: true, enchantment: 7 }],
        { yearsWithMHPCO: 3 },
        { isFollowUpContract: true },
      ),
    ).toBe(160);
  });
  it("rounds a 197.5 G premium up in the MHPCO's favor to 198 G (7 runes, 0-year customer)", () => {
    const runes = Array.from({ length: 7 }, () => ({ type: "rune" }));
    expect(quotePremium(runes, { yearsWithMHPCO: 0 })).toBe(198);
  });
});
