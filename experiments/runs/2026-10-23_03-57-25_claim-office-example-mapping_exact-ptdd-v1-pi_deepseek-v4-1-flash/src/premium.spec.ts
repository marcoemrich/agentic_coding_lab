import { describe, expect, it } from "vitest";
import { basePremium, itemPremium, quotePremium } from "./premium.js";

// Inactive test list for premium (quote) behavior.
// Activate exactly one entry per Predictive TDD cycle.
describe("MHPCO premium", () => {
  it("quote with an empty item list -> premium 5 G (only the processing fee)", () => {
    expect(quotePremium([], { yearsWithMHPCO: 0, previousQuotes: 0 })).toBe(5);
  });
  it("sword base premium is 100 G", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("amulet base premium is 60 G", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("staff base premium is 80 G", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("potion base premium is 40 G", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });
  it("rune base premium is 25 G", () => {
    expect(basePremium([{ type: "rune" }])).toBe(25);
  });
  it("moonstone base premium is 25 G", () => {
    expect(basePremium([{ type: "moonstone" }])).toBe(25);
  });
  it("2 runes -> 50 G base premium", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("3 runes -> 60 G base premium (block applies)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("4 runes -> 100 G base premium (no block: block requires exactly 3)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100);
  });
  it("7 runes -> 175 G base premium (block requires exactly 3, so 7 runes are not blocked)", () => {
    expect(
      basePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ]),
    ).toBe(175);
  });
  it("2 runes + 1 moonstone -> 75 G base premium (no block: different types)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("3 runes + 3 moonstones -> 120 G base premium (two separate blocks)", () => {
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
  it("plain sword item premium is 100 G (no surcharge)", () => {
    expect(itemPremium({ type: "sword" })).toBe(100);
  });
  it("cursed sword item premium is 150 G (50 % risk surcharge)", () => {
    expect(itemPremium({ type: "sword", cursed: true })).toBe(150);
  });
  it("sword item premium with enchantment 4 is 100 G (no high-enchantment surcharge)", () => {
    expect(itemPremium({ type: "sword", enchantment: 4 })).toBe(100);
  });
  it("sword item premium with enchantment 5 is 130 G (high-enchantment surcharge at the boundary)", () => {
    expect(itemPremium({ type: "sword", enchantment: 5 })).toBe(130);
  });
  it("cursed sword item premium with enchantment 5 is 180 G (both surcharges apply)", () => {
    expect(itemPremium({ type: "sword", enchantment: 5, cursed: true })).toBe(180);
  });
  it("cursed sword + plain amulet -> item premiums sum to 210 G (curse is 50 % of the cursed item's base premium, not of the policy total)", () => {
    expect(basePremium([{ type: "sword", cursed: true }, { type: "amulet" }])).toBe(210);
  });
  it("newcomer with a cursed sword -> premium 165 G", () => {
    expect(quotePremium([{ type: "sword", cursed: true }], { yearsWithMHPCO: 0, previousQuotes: 0 })).toBe(165);
  });
  it("long-standing customer's second contract -> premium 160 G", () => {
    expect(
      quotePremium([{ type: "sword", enchantment: 7, cursed: true }], { yearsWithMHPCO: 3, previousQuotes: 1 }),
    ).toBe(160);
  });
  it("customer with exactly 2 years -> loyalty discount applies (plain sword quote 95 G)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 2, previousQuotes: 0 })).toBe(95);
  });
  it("customer with 1 year -> no loyalty discount (plain sword quote 115 G)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 1, previousQuotes: 0 })).toBe(115);
  });
  it("second quote with 0 years -> 100 G (10 % first insurance still applies, 15 % follow-up discount)", () => {
    expect(quotePremium([{ type: "sword" }], { yearsWithMHPCO: 0, previousQuotes: 1 })).toBe(100);
  });
  it("processing fee is added once at the very end (sword + amulet -> 181 G)", () => {
    expect(quotePremium([{ type: "sword" }, { type: "amulet" }], { yearsWithMHPCO: 0, previousQuotes: 0 })).toBe(181);
  });
  it("single rune, 0 years, first quote -> 32.5 G rounds up to 33 G in the MHPCO's favor", () => {
    expect(quotePremium([{ type: "rune" }], { yearsWithMHPCO: 0, previousQuotes: 0 })).toBe(33);
  });
  it("sword + 3 runes block, 3 years, first quote -> 149 G (block affects the premium only, loyalty applies to the policy base)", () => {
    expect(
      quotePremium(
        [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        { yearsWithMHPCO: 3, previousQuotes: 0 },
      ),
    ).toBe(149);
  });
});
