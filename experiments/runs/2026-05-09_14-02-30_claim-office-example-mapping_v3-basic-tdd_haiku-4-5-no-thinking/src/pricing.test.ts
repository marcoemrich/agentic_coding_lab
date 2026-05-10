import { describe, it, expect } from "vitest";
import {
  calculateBasePremium,
  calculateInsuranceSum,
  calculatePremium,
  calculateItemModifier,
  calculatePolicyModifier,
  calculateComponentBlockPremium,
} from "./pricing";
import type { Item } from "./types";

describe("Pricing - Base Premiums", () => {
  it("should return correct insurance value and base premium for main items", () => {
    expect(calculateBasePremium([{ type: "sword" }])).toBe(100);
    expect(calculateBasePremium([{ type: "amulet" }])).toBe(60);
    expect(calculateBasePremium([{ type: "staff" }])).toBe(80);
    expect(calculateBasePremium([{ type: "potion" }])).toBe(40);
  });

  it("should calculate base premium for components without block", () => {
    expect(calculateBasePremium([{ type: "rune" }])).toBe(25);
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }])).toBe(50);
    expect(calculateBasePremium([{ type: "moonstone" }])).toBe(25);
  });

  it("should apply component block discount for exactly 3 alike items", () => {
    // 3 runes → 60 G base premium (block applies)
    expect(calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "rune" }])).toBe(
      60
    );
  });

  it("should not apply block for 4 components (block requires exactly 3)", () => {
    // 4 runes → 100 G base premium (no block)
    expect(
      calculateBasePremium([
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
        { type: "rune" },
      ])
    ).toBe(100);
  });

  it("should handle 7 components as 2 blocks + 1 extra", () => {
    // 7 runes → 175 G (60 + 60 + 25 for remaining 2)
    const runes = Array(7).fill({ type: "rune" });
    expect(calculateComponentBlockPremium(runes)).toBe(175);
  });

  it("should not apply block to mixed component types", () => {
    // 2 runes + 1 moonstone → 75 G (no block: different types)
    expect(
      calculateBasePremium([{ type: "rune" }, { type: "rune" }, { type: "moonstone" }])
    ).toBe(75);
  });

  it("should apply separate blocks to different component types", () => {
    // 3 runes + 3 moonstones → 120 G (two separate blocks)
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ];
    expect(calculateBasePremium(items)).toBe(120);
  });

  it("should handle empty item list", () => {
    expect(calculateBasePremium([])).toBe(0);
  });

  it("should throw error for unknown item type", () => {
    expect(() => calculateBasePremium([{ type: "broomstick" as any }])).toThrow();
  });
});

describe("Pricing - Insurance Sum", () => {
  it("should calculate correct insurance sum", () => {
    expect(calculateInsuranceSum([{ type: "sword" }])).toBe(1000);
    expect(calculateInsuranceSum([{ type: "amulet" }])).toBe(600);
    expect(calculateInsuranceSum([{ type: "rune" }])).toBe(250);
  });

  it("should sum multiple items correctly", () => {
    // sword + amulet = 1000 + 600 = 1600
    const items: Item[] = [{ type: "sword" }, { type: "amulet" }];
    expect(calculateInsuranceSum(items)).toBe(1600);
  });

  it("should handle multiple items of same type", () => {
    // 2 swords = 2000
    expect(calculateInsuranceSum([{ type: "sword" }, { type: "sword" }])).toBe(2000);
  });
});

describe("Pricing - Item Modifiers", () => {
  it("should add 50% curse surcharge on item base premium", () => {
    // Cursed sword: base 100, surcharge 50
    const modifier = calculateItemModifier({ type: "sword", cursed: true });
    expect(modifier).toBe(50);
  });

  it("should add 30% high enchantment surcharge for enchantment >= 5", () => {
    // Sword with enchantment 5: base 100, surcharge 30
    const modifier = calculateItemModifier({ type: "sword", enchantment: 5 });
    expect(modifier).toBe(30);
  });

  it("should not apply high enchantment surcharge for enchantment < 5", () => {
    const modifier = calculateItemModifier({ type: "sword", enchantment: 4 });
    expect(modifier).toBe(0);
  });

  it("should apply both curse and enchantment surcharges", () => {
    // Cursed sword with enchantment 5: base 100, curse 50, enchantment 30 = 80
    const modifier = calculateItemModifier({
      type: "sword",
      enchantment: 5,
      cursed: true,
    });
    expect(modifier).toBe(80);
  });

  it("should return 0 for item with no modifiers", () => {
    const modifier = calculateItemModifier({ type: "sword" });
    expect(modifier).toBe(0);
  });
});

describe("Pricing - Policy Modifiers", () => {
  it("should apply 20% loyalty discount for customers with >= 2 years", () => {
    // 100 G base, 20% loyalty = -20 G
    const modifier = calculatePolicyModifier(100, 2, false, false);
    expect(modifier).toBe(-20);
  });

  it("should not apply loyalty discount for customers with < 2 years", () => {
    const modifier = calculatePolicyModifier(100, 1, false, false);
    expect(modifier).toBe(0);
  });

  it("should apply 10% first insurance surcharge", () => {
    // 100 G base, 10% first = +10 G
    const modifier = calculatePolicyModifier(100, 0, true, false);
    expect(modifier).toBe(10);
  });

  it("should apply 15% follow-up contract discount", () => {
    // 100 G base, 15% follow-up = -15 G
    const modifier = calculatePolicyModifier(100, 0, false, true);
    expect(modifier).toBe(-15);
  });

  it("should combine loyalty, first insurance, and follow-up modifiers", () => {
    // 100 G base
    // loyalty: -20, first: +10, follow-up: -15
    // total: -25
    const modifier = calculatePolicyModifier(100, 2, true, true);
    expect(modifier).toBe(10 - 20 - 15);
  });
});

describe("Pricing - Full Premium Calculation", () => {
  it("should calculate premium for single plain item", () => {
    // Sword: base 100, no modifiers, + 5 fee = 105
    const premium = calculatePremium([{ type: "sword" }], 0, false, false);
    expect(premium).toBe(105);
  });

  it("should calculate premium for newcomer with cursed sword", () => {
    // Integration example: newcomer with cursed sword
    // base 100 + curse 50 + first 10 + fee 5 = 165
    const premium = calculatePremium(
      [{ type: "sword", cursed: true }],
      0,
      true,
      false
    );
    expect(premium).toBe(165);
  });

  it("should calculate premium for long-standing customer's second contract", () => {
    // Integration example: 3-year customer, cursed sword with enchantment 7
    // base 100 + curse 50 + enchantment 30 - loyalty 20 + first 10 - follow-up 15 + fee 5 = 160
    const premium = calculatePremium(
      [{ type: "sword", cursed: true, enchantment: 7 }],
      3,
      true,
      true
    );
    expect(premium).toBe(160);
  });

  it("should round up in MHPCO favor (ceiling)", () => {
    // Should round up for any fractional premium
    const premium = calculatePremium([{ type: "amulet" }], 0, false, false);
    // base 60 + fee 5 = 65
    expect(premium).toBe(65);
  });

  it("should calculate empty policy premium (only fee)", () => {
    // Empty item list → premium 5 G (only processing fee)
    const premium = calculatePremium([], 0, false, false);
    expect(premium).toBe(5);
  });

  it("should handle multi-item policy with mixed modifiers", () => {
    // Cursed sword (base 100) + plain amulet (base 60)
    // Policy base: 160
    // Curse on sword: 50 (50% of sword base)
    // First insurance: 16 (10% of policy base 160)
    // 160 + 50 + 16 + 5 (fee) = 231
    const premium = calculatePremium(
      [{ type: "sword", cursed: true }, { type: "amulet" }],
      0,
      true,
      false
    );
    expect(premium).toBe(231);
  });
});
