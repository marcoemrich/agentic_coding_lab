import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: base premiums
  it("should return 5 G premium for an empty item list (processing fee only)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [] }],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("should return 105 G premium for a single sword (100 base + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should return 65 G premium for a single amulet (60 base + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should return 85 G premium for a single staff (80 base + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("should return 45 G premium for a single potion (40 base + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 49 });
  });
  it("should return 30 G premium for a single rune component (25 base + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 33 });
  });
  it("should return 165 G premium for a sword and an amulet (100 + 60 base + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 181 });
  });

  // Quote: component block pricing
  it("should return 55 G premium for 2 runes (2 * 25 = 50 base + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("should return 65 G premium for 3 runes (block of 3 alike = 60 base + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should return 105 G premium for 4 runes (no block, 4 * 25 = 100 base + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should return 80 G premium for 2 runes + 1 moonstone (no block, different types, 75 base + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("should return 125 G premium for 3 runes + 3 moonstones (two blocks, 60 + 60 = 120 base + 5 fee)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // Quote: item-specific modifiers
  it("should add 50% curse surcharge to a cursed sword (100 + 50 = 150 base + 5 fee = 155 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        },
      ],
    };
    const result = processScenario(scenario);
    // cursed sword: 100 base + 50 curse = 150 item; policy base = 100; +10% of 100 = 10; 150 + 10 = 160 + 5 fee = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("should add 30% high-enchantment surcharge for enchantment >= 5 (100 + 30 = 130 base + 5 fee = 135 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    // enchanted sword: 100 base + 30 enchantment = 130 item; policy base = 100; +10% of 100 = 10; 130 + 10 = 140 + 5 fee = 145
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("should apply both curse and high-enchantment surcharges on same item (100 + 50 + 30 = 180 base + 5 fee = 185 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    };
    const result = processScenario(scenario);
    // cursed+enchanted sword: 100 base + 50 curse + 30 enchantment = 180 item; policy base = 100; +10% of 100 = 10; 180 + 10 = 190 + 5 fee = 195
    expect(result.results[0]).toEqual({ premium: 195 });
  });
  it("should apply item-specific modifiers only to the affected item in a multi-item policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    };
    const result = processScenario(scenario);
    // sword: 100 + 50 (curse) = 150; amulet: 60; item total: 210; policy base: 160; +10% of 160 = 16; 210 + 16 = 226 + 5 = 231
    expect(result.results[0]).toEqual({ premium: 231 });
  });

  // Quote: policy-wide modifiers
  it("should apply 10% first-insurance surcharge to every quote (100 + 10 = 110 base + 5 fee = 115 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("should apply 20% loyalty discount for customers with >= 2 years", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    };
    const result = processScenario(scenario);
    // sword: 100 base, policy-wide: +10% first insurance (+10), -20% loyalty (-20) = 90, + 5 fee = 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("should apply 15% follow-up discount on second and subsequent quotes", () => {
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
    // First quote: 100 * 1.1 + 5 = 115 (no follow-up)
    expect(result.results[0]).toEqual({ premium: 115 });
    // Second quote: 100 base, +10% first ins (+10), -15% follow-up (-15) = 95, + 5 fee = 100
    expect(result.results[1]).toEqual({ premium: 100 });
  });

  // Quote: modifier stacking and rounding
  it("should stack item-specific and policy-wide modifiers correctly (newcomer cursed sword = 165 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };
    const result = processScenario(scenario);
    // 100 base + 50 curse = 150 item total; policy base = 100; +10% of 100 = 10; 150 + 10 = 160 + 5 fee = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("should stack all modifiers for long-standing customer second contract (cursed enchanted sword = 160 G)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    const result = processScenario(scenario);
    // Second quote, long-standing customer:
    // sword: 100 base + 50 curse + 30 enchantment = 180 item
    // policy base = 100; +10% first ins (+10), -20% loyalty (-20), -15% follow-up (-15) = -25
    // total = 180 + (-25) = 155 + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });
  it("should round premiums up in MHPCO's favor", () => {
    // A scenario that produces a fractional premium before rounding
    // 2 runes + 1 moonstone: raw base = 75, item total = 75, +10% of 75 = 7.5, total = 82.5 + 5 = 87.5 → ceil = 88
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };
    const result = processScenario(scenario);
    expect(result.results[0]).toEqual({ premium: 88 });
  });

  // Claim: basic payout
  it("should pay damage minus 100 G deductible for a standard item", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // payout: 500 - 100 deductible = 400; cap: 2 * 1000 = 2000; remaining: 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should reimburse at 50% for items with enchantment >= 8, then apply deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // 50% of 1000 = 500, minus 100 deductible = 400; cap = 2000; remaining = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should fully reimburse dragon-material items, then apply deductible", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // dragon material: full reimbursement, then deductible: 800 - 100 = 700; cap = 2000; remaining = 1300
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("should apply 50% rule when item has both enchantment >= 8 and dragon material", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // both clauses: 50% wins → 500, minus deductible 100 = 400; cap 2000; remaining 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should apply deductible per damaged item in a multi-item claim", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // sword: 500 - 100 = 400; amulet: 300 - 100 = 200; total = 600
    // cap = 2 * (1000 + 600) = 3200; remaining = 3200 - 600 = 2600
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Claim: cap
  it("should cap total payout at 2x insurance sum", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "potion", amount: 1000 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // potion insurance = 400, cap = 800; damage 1000 - 100 deductible = 900, capped at 800
    // remaining cap = 0
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 0 });
  });
  it("should track remaining cap across multiple claims on the same policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "flood",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // sword: insurance 1000, cap 2000
    // first claim: 1500 - 100 = 1400, remaining cap = 600
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    // second claim: 1500 - 100 = 1400, capped at 600, remaining cap = 0
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Claim: components
  it("should apply standard reimbursement to components (no enchantment or material)", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    };
    const result = processScenario(scenario);
    // rune: 200 - 100 deductible = 100; cap = 2 * 250 = 500; remaining = 400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Error handling
  it("should reject unknown item types in a quote", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "broomstick" }],
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should reject claim damage for item not in the policy", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should reject negative damage amounts", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };
    expect(() => processScenario(scenario)).toThrow();
  });
  it("should reject more damages of a type than items insured", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    };
    // only 1 sword insured but 2 sword damages
    expect(() => processScenario(scenario)).toThrow();
  });
});
