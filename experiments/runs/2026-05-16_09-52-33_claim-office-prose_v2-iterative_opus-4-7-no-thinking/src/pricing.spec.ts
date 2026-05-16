import { describe, it, expect } from "vitest";
import { computePremium, totalInsuranceSum, roundFavor } from "./pricing.js";
import type { Item } from "./types.js";

describe("roundFavor", () => {
  it("rounds up fractional amounts", () => {
    expect(roundFavor(57.8)).toBe(58);
    expect(roundFavor(100)).toBe(100);
    expect(roundFavor(0.1)).toBe(1);
  });
});

describe("totalInsuranceSum", () => {
  it("computes for main items", () => {
    const items: Item[] = [
      { type: "sword" },
      { type: "amulet" },
    ];
    expect(totalInsuranceSum(items)).toBe(1600);
  });

  it("computes for components", () => {
    const items: Item[] = [
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
    ];
    expect(totalInsuranceSum(items)).toBe(750);
  });
});

describe("computePremium", () => {
  it("first quote, no modifiers — sword", () => {
    // base 100, ×1.1 (first), +5 = 115
    const items: Item[] = [
      { type: "sword", material: "steel", enchantment: 3, cursed: false },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(
      115,
    );
  });

  it("loyal customer, first quote — amulet", () => {
    // base 60, ×0.8 = 48, ×1.1 = 52.8, +5 = 57.8 → 58
    const items: Item[] = [
      { type: "amulet", material: "silver", enchantment: 2, cursed: false },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 5, contractIndex: 0 })).toBe(
      58,
    );
  });

  it("applies cursed surcharge per item", () => {
    // base 100, ×1.5 = 150, ×1.1 = 165, +5 = 170
    const items: Item[] = [
      { type: "sword", material: "steel", enchantment: 1, cursed: true },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(
      170,
    );
  });

  it("applies high enchant surcharge per item", () => {
    // base 80, ×1.3 = 104, ×1.1 = 114.4, +5 = 119.4 → 120
    const items: Item[] = [
      { type: "staff", material: "oak", enchantment: 5, cursed: false },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(
      120,
    );
  });

  it("stacks cursed and high enchant", () => {
    // base 40, ×1.5 ×1.3 = 78, ×1.1 = 85.8, +5 = 90.8 → 91
    const items: Item[] = [
      { type: "potion", material: "glass", enchantment: 7, cursed: true },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(
      91,
    );
  });

  it("applies subsequent-contract discount", () => {
    // base 100, ×0.85 = 85, +5 = 90
    const items: Item[] = [
      { type: "sword", material: "steel", enchantment: 1, cursed: false },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 1 })).toBe(
      90,
    );
  });

  it("uses component bundle discount for 3 alike", () => {
    // 3 runes bundled = 60 base, ×1.1 = 66, +5 = 71
    const items: Item[] = [
      { type: "rune", enchantment: 1, cursed: false },
      { type: "rune", enchantment: 1, cursed: false },
      { type: "rune", enchantment: 1, cursed: false },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(
      71,
    );
  });

  it("uses individual component base for non-bundled", () => {
    // 2 runes individually = 50, ×1.1 = 55, +5 = 60
    const items: Item[] = [
      { type: "rune", enchantment: 1, cursed: false },
      { type: "rune", enchantment: 1, cursed: false },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(
      60,
    );
  });

  it("bundles 3 then leaves remaining individual", () => {
    // 4 runes: 3 bundled (60) + 1 (25) = 85, ×1.1 = 93.5, +5 = 98.5 → 99
    const items: Item[] = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(
      99,
    );
  });

  it("does not bundle across different component types", () => {
    // 2 runes + 1 moonstone = 75 individually, no bundle
    // ×1.1 = 82.5, +5 = 87.5 → 88
    const items: Item[] = [
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
    ];
    expect(computePremium(items, { yearsWithMHPCO: 0, contractIndex: 0 })).toBe(
      88,
    );
  });
});
