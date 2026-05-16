import { describe, expect, it } from "vitest";
import { computeInsuranceSum, computeItemsBasePremium, computePremium } from "./quote.js";
import type { Customer, Item } from "./types.js";

describe("computeInsuranceSum", () => {
  it("sums main items", () => {
    const items: Item[] = [
      { type: "sword" },
      { type: "amulet" },
      { type: "staff" },
      { type: "potion" },
    ];
    expect(computeInsuranceSum(items)).toBe(1000 + 600 + 800 + 400);
  });

  it("counts components at 250 each", () => {
    const items: Item[] = [
      { type: "rune" },
      { type: "moonstone" },
      { type: "rune" },
    ];
    expect(computeInsuranceSum(items)).toBe(750);
  });
});

describe("computeItemsBasePremium", () => {
  it("sums base premiums for main items", () => {
    const items: Item[] = [{ type: "sword" }, { type: "amulet" }];
    expect(computeItemsBasePremium(items)).toBe(100 + 60);
  });

  it("applies cursed surcharge (+50%)", () => {
    const items: Item[] = [{ type: "sword", cursed: true }];
    expect(computeItemsBasePremium(items)).toBe(150);
  });

  it("applies high enchantment surcharge (+30%) at level 5", () => {
    const items: Item[] = [{ type: "sword", enchantment: 5 }];
    expect(computeItemsBasePremium(items)).toBe(130);
  });

  it("does not apply high enchantment surcharge below level 5", () => {
    const items: Item[] = [{ type: "sword", enchantment: 4 }];
    expect(computeItemsBasePremium(items)).toBe(100);
  });

  it("stacks cursed and high enchantment surcharges multiplicatively", () => {
    const items: Item[] = [{ type: "sword", cursed: true, enchantment: 7 }];
    // 100 * 1.5 * 1.3 = 195
    expect(computeItemsBasePremium(items)).toBe(195);
  });

  it("treats 3 alike components as a building block (60 G)", () => {
    const items: Item[] = [{ type: "rune" }, { type: "rune" }, { type: "rune" }];
    expect(computeItemsBasePremium(items)).toBe(60);
  });

  it("treats 4 alike components as a bundle plus a single", () => {
    const items: Item[] = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
    ];
    expect(computeItemsBasePremium(items)).toBe(60 + 25);
  });

  it("treats different component types separately", () => {
    const items: Item[] = [
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
    ];
    // 2 runes (singles) + 1 moonstone (single)
    expect(computeItemsBasePremium(items)).toBe(25 + 25 + 25);
  });
});

describe("computePremium", () => {
  const baseCustomer: Customer = { yearsWithMHPCO: 0 };

  it("adds a 5 G processing fee", () => {
    // First insurance: 10% surcharge.
    // Sword base 100, *1.1 = 110, + 5 = 115.
    const premium = computePremium([{ type: "sword" }], {
      customer: baseCustomer,
      priorPolicyCount: 0,
    });
    expect(premium).toBe(115);
  });

  it("applies 20% loyalty discount for long-standing customers", () => {
    const loyal: Customer = { yearsWithMHPCO: 2 };
    // 100 * 0.8 * 1.1 + 5 = 88 + 5 = 93
    const premium = computePremium([{ type: "sword" }], {
      customer: loyal,
      priorPolicyCount: 0,
    });
    expect(premium).toBe(93);
  });

  it("applies 15% discount for non-first contracts", () => {
    // 100 * 0.85 + 5 = 85 + 5 = 90
    const premium = computePremium([{ type: "sword" }], {
      customer: baseCustomer,
      priorPolicyCount: 1,
    });
    expect(premium).toBe(90);
  });

  it("rounds up in MHPCO's favor", () => {
    // Amulet 60 base * 0.85 = 51 + 5 = 56
    // Use a value that doesn't end in whole gold:
    // Potion 40 * 1.1 = 44 + 5 = 49 (already whole) — try cursed potion
    // 40 * 1.5 * 1.1 = 66 + 5 = 71 (whole)
    // Use loyalty + first ins on amulet: 60 * 0.8 * 1.1 = 52.8, + 5 = 57.8 -> ceil 58
    const loyal: Customer = { yearsWithMHPCO: 5 };
    const premium = computePremium([{ type: "amulet" }], {
      customer: loyal,
      priorPolicyCount: 0,
    });
    expect(premium).toBe(58);
  });
});
