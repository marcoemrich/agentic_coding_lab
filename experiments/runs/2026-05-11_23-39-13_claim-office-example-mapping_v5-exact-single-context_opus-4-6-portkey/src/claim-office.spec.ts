import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote - base premiums
  it("should return 5G premium for empty items list (processing fee only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote" as const, items: [] },
      ],
    };
    const result = processScenario(scenario);
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("should compute premium for a single plain sword (base + first insurance + fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // base 100 + first insurance 10% of 100 = 10 + fee 5 = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should compute correct base premium for each main item type (amulet, staff, potion)", () => {
    const makeScenario = (type: string) => ({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type, material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    // amulet: 60 base + 6 first insurance + 5 fee = 71
    expect(processScenario(makeScenario("amulet"))).toEqual({ results: [{ premium: 71 }] });
    // staff: 80 base + 8 first insurance + 5 fee = 93
    expect(processScenario(makeScenario("staff"))).toEqual({ results: [{ premium: 93 }] });
    // potion: 40 base + 4 first insurance + 5 fee = 49
    expect(processScenario(makeScenario("potion"))).toEqual({ results: [{ premium: 49 }] });
  });
  it("should compute base premium for components (25G each)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // 2 runes: 2 * 25 = 50 base + 5 first insurance + 5 fee = 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("should apply block discount for exactly 3 alike components (60G instead of 75G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // 3 runes block: 60 base + 6 first insurance + 5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("should not apply block discount for component counts other than 3", () => {
    const makeScenario = (items: Array<{ type: string }>) => ({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items }],
    });
    // 4 runes: no block, 4 * 25 = 100 base + 10 first insurance + 5 fee = 115
    expect(processScenario(makeScenario([
      { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
    ]))).toEqual({ results: [{ premium: 115 }] });
    // 2 runes + 1 moonstone: no block (different types), 3 * 25 = 75 base + 7.5 + 5 = 87.5 → 88 (rounded up)
    expect(processScenario(makeScenario([
      { type: "rune" }, { type: "rune" }, { type: "moonstone" },
    ]))).toEqual({ results: [{ premium: 88 }] });
    // 3 runes + 3 moonstones: two separate blocks, 60 + 60 = 120 base + 12 + 5 = 137
    expect(processScenario(makeScenario([
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ]))).toEqual({ results: [{ premium: 137 }] });
  });

  // Quote - item-specific modifiers
  it("should apply 50% cursed surcharge on the cursed item base premium only", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // base 100 + cursed surcharge 50 (50% of 100) + first insurance 10 (10% of 100) + fee 5 = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("should apply 30% high enchantment surcharge for enchantment level >= 5", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // base 100 + enchantment surcharge 30 (30% of 100) + first insurance 10 + fee 5 = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });

  // Quote - policy-wide modifiers
  it("should apply 20% loyalty discount for customers with >= 2 years", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // base 100 + first insurance 10 (10% of 100) - loyalty 20 (20% of 100) + fee 5 = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("should apply 15% follow-up contract discount on the second quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    // first quote: 100 + 10 + 5 = 115
    // second quote: 100 + 10 - 15 (15% of 100) + 5 = 100
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // Quote - multi-item and integration
  it("should compute premium for multi-item policy applying item-specific modifiers per item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // policy base: 100 + 60 = 160
    // cursed surcharge: 50 (50% of sword's 100, not policy total)
    // first insurance: 16 (10% of 160)
    // fee: 5
    // total: 160 + 50 + 16 + 5 = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });
  it("should round premium up in MHPCO's favor", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // 3 components (no block — different types): 75 base + 7.5 first insurance + 5 fee = 87.5 → 88 (rounded up)
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("should compute 165G for newcomer with cursed sword (integration example 1)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // 100 base + 50 curse + 10 first insurance + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("should compute 160G for long-standing customer's second contract (integration example 2)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // first quote: 100 + 10 - 20 + 5 = 95
    // second quote: 100 + 50 curse + 30 high ench + 10 first insurance - 20 loyalty - 15 follow-up + 5 fee = 160
    expect(result).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });

  // Claim - basic
  it("should apply 100G deductible per damaged item in a claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // quote: 100 + 10 + 5 = 115
    // claim: 500 - 100 deductible = 400 payout, cap = 2000 (2 * 1000), remaining = 2000 - 400 = 1600
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("should cap total payout at twice the insurance sum", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 2500 },
            ],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // cap = 2 * 1000 = 2000; damage 2500 - 100 deductible = 2400, capped to 2000
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 2000, remainingCap: 0 },
      ],
    });
  });
  it("should reimburse at 50% for items with enchantment >= 8", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 1000 },
            ],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // enchantment 9 >= 8: reimburse at 50% → 1000 * 0.5 = 500, then deductible 500 - 100 = 400
    // cap = 2000, remaining = 2000 - 400 = 1600
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("should fully reimburse damage to dragon material items", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "dragon", enchantment: 5, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 800 },
            ],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // dragon material: full reimbursement, then deductible: 800 - 100 = 700
    // cap = 2000, remaining = 2000 - 700 = 1300
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ],
    });
  });
  it("should track remaining cap across multiple claims on the same policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // quote: 115
    // first claim: 1500 - 100 = 1400, cap 2000, payout 1400, remaining 600
    // second claim: 1500 - 100 = 1400, but remaining cap is 600, payout 600, remaining 0
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
  it("should round payout down in MHPCO's favor", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 501 },
            ],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // enchantment 9 >= 8: 50% reimbursement → 501 * 0.5 = 250.5, minus 100 = 150.5 → round down = 150
    // cap = 2000, remaining = 2000 - 150 = 1850
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 150, remainingCap: 1850 },
      ],
    });
  });

  // Error handling
  it("should reject unknown item types with non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "broomstick", material: "wood", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow("Unknown item type: broomstick");
  });
  it("should reject negative damage amounts with non-zero exit", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "theft",
            damages: [
              { itemType: "sword", amount: -200 },
            ],
          },
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow("Negative damage amount");
  });
  it("should reject damage entries for items not in the policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should reject damage entries exceeding insured item count", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };
    // policy covers 1 sword, but damages has 2 sword entries
    expect(() => processScenario(scenario)).toThrow();
  });
});
