import { describe, it, expect } from "vitest";
import { basePremium, quote } from "./quote.js";

describe("MHPCO base premium", () => {
  it("should return 0 for empty item list", () => {
    expect(basePremium([])).toBe(0);
  });

  it("should return 100 G for a sword", () => {
    expect(basePremium([{ type: "sword" }])).toBe(100);
  });
  it("should return 60 G for an amulet", () => {
    expect(basePremium([{ type: "amulet" }])).toBe(60);
  });
  it("should return 80 G for a staff", () => {
    expect(basePremium([{ type: "staff" }])).toBe(80);
  });
  it("should return 40 G for a potion", () => {
    expect(basePremium([{ type: "potion" }])).toBe(40);
  });

  it("should return 50 G for two runes (no building block)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
  });
  it("should return 60 G for three runes (building block of 3)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(60);
  });
  it("should return 100 G for four runes (no block, block requires exactly 3)", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(100);
  });
  it("should return 175 G for seven runes (no block)", () => {
    const items = new Array(7).fill({ type: "rune" });
    expect(basePremium(items)).toBe(175);
  });

  it("should treat different component types as not alike -- 2 runes + 1 moonstone -> 75 G", () => {
    expect(basePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])).toBe(75);
  });
  it("should form two separate blocks for 3 runes + 3 moonstones -- 120 G", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    expect(basePremium(items)).toBe(120);
  });
});

describe("MHPCO quote (full premium)", () => {
  it("should return 5 G (only processing fee) for empty item list", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [], 1)).toBe(5);
  });

  it("should apply cursed surcharge only to the cursed item -- cursed sword + plain amulet -> 231 G", () => {
    const items = [{ type: "sword", cursed: true }, { type: "amulet" }];
    expect(quote({ yearsWithMHPCO: 0 }, items, 1)).toBe(231);
  });

  it("should apply loyalty discount at exactly 2 years -- plain sword -> 95 G", () => {
    expect(quote({ yearsWithMHPCO: 2 }, [{ type: "sword" }], 1)).toBe(95);
  });
  it("should NOT apply loyalty discount at 1 year -- plain sword -> 115 G", () => {
    expect(quote({ yearsWithMHPCO: 1 }, [{ type: "sword" }], 1)).toBe(115);
  });

  it("should apply high-enchantment surcharge at exactly enchantment 5 -- sword -> 145 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5 }], 1)).toBe(145);
  });
  it("should apply both curse and high-enchantment surcharges -- cursed sword ench 5 -> 195 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 5, cursed: true }], 1)).toBe(195);
  });
  it("should NOT apply high-enchantment surcharge at enchantment 4 -- sword -> 115 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", enchantment: 4 }], 1)).toBe(115);
  });

  it("should round premium up in MHPCO's favor -- 7 runes -> 198 G (197.5 rounded up)", () => {
    const items = new Array(7).fill({ type: "rune" });
    expect(quote({ yearsWithMHPCO: 0 }, items, 1)).toBe(198);
  });

  it("should compute newcomer with a cursed sword -> 165 G", () => {
    expect(quote({ yearsWithMHPCO: 0 }, [{ type: "sword", cursed: true, enchantment: 3 }], 1)).toBe(165);
  });

  it("should compute a long-standing customer's second contract -> 160 G", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword", cursed: true, enchantment: 7 }], 2)).toBe(160);
  });

  it("should apply first-insurance surcharge per item regardless of customer history", () => {
    expect(quote({ yearsWithMHPCO: 3 }, [{ type: "sword", cursed: true, enchantment: 7 }], 2)).toBe(160);
  });

  it("should reject a quote with an unknown item type", () => {
    expect(() => quote({ yearsWithMHPCO: 0 }, [{ type: "broomstick" }], 1)).toThrow();
  });
});