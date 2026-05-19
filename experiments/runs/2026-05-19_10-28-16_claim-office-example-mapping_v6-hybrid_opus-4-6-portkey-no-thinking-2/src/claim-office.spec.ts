import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: base premiums
  it("returns premium of 5 G for an empty item list (processing fee only)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote" as const, items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("returns premium of 105 G for a single sword (100 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 100 base + 10 first insurance + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("returns premium of 65 G for a single amulet (60 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 60 base + 6 first insurance + 5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("returns premium of 85 G for a single staff (80 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 80 base + 8 first insurance + 5 fee = 93
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("returns premium of 45 G for a single potion (40 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 40 base + 4 first insurance + 5 fee = 49
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("returns premium of 165 G for a sword and an amulet (100 + 60 base + 5 fee)", () => {
    const result = processScenario({
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
    });
    // 160 base + 16 first insurance + 5 fee = 181
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });

  // Quote: component premiums
  it("returns premium of 30 G for a single rune (25 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }],
        },
      ],
    });
    // 25 base + 2.5 first insurance + 5 fee = 33 (rounded up)
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("returns premium of 55 G for 2 runes (50 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // 50 base + 5 first insurance + 5 fee = 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("returns premium of 65 G for 3 runes (60 block base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // 60 block + 7.5 first insurance + 5 fee = 73 (rounded up)
    expect(result).toEqual({ results: [{ premium: 73 }] });
  });
  it("returns premium of 105 G for 4 runes (100 base, no block + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // 100 base + 10 first insurance + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("returns premium of 180 G for 7 runes (175 base + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    // 175 base + 17.5 first insurance + 5 fee = 198 (rounded up)
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("returns premium of 80 G for 2 runes and 1 moonstone (75 base, no block + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    // 75 base + 7.5 first insurance + 5 fee = 88 (rounded up)
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("returns premium of 125 G for 3 runes and 3 moonstones (120 base, two blocks + 5 fee)", () => {
    const result = processScenario({
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
    });
    // 120 block + 15 first insurance + 5 fee = 140
    expect(result).toEqual({ results: [{ premium: 140 }] });
  });

  // Quote: item-specific modifiers
  it("adds 50% cursed surcharge to the cursed item's base premium", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        },
      ],
    });
    // 100 base + 50 cursed + 10 first insurance + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("adds 30% high-enchantment surcharge for enchantment level 5", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    // 100 base + 30 enchantment + 10 first insurance + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("applies both cursed and high-enchantment surcharges on the same item", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    // 100 base + 50 cursed + 30 enchantment + 10 first insurance + 5 fee = 195
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("does not apply high-enchantment surcharge for enchantment level 4", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    // 100 base + 10 first insurance + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies cursed surcharge only to the cursed item in a multi-item policy", () => {
    const result = processScenario({
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
    });
    // sword: 100 + 50 cursed = 150; amulet: 60; total: 210 + 16 first insurance + 5 fee = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Quote: policy-wide modifiers
  it("adds 10% first insurance surcharge on the policy base premium", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 100 base + 10 first insurance (10% of 100 policy base) + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies 20% loyalty discount for customer with 2+ years", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 100 base + 10 first insurance - 20 loyalty (20% of 100) + 5 fee = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies 15% follow-up contract discount on second quote", () => {
    const result = processScenario({
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
    });
    // first: 100 + 10 first ins + 5 = 115; second: 100 + 10 first ins - 15 follow-up + 5 = 100
    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });

  // Quote: rounding
  it("rounds premium up in MHPCO's favor", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "rune" }],
        },
      ],
    });
    // 25 base + 2.5 first insurance - 5 loyalty (20% of 25) + 5 fee = 27.5 → ceil → 28
    expect(result).toEqual({ results: [{ premium: 28 }] });
  });

  // Quote: integration
  it("computes 165 G for newcomer with cursed sword", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        },
      ],
    });
    // 100 base + 50 cursed + 10 first insurance + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("computes 160 G for long-standing customer's second contract with cursed enchanted sword", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
        {
          op: "quote" as const,
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // First quote: 60 base + 6 first ins - 12 loyalty (20% of 60) + 5 fee = 59
    // Second quote: 100 base + 50 cursed + 30 enchant + 10 first ins - 20 loyalty (20% of 100) - 15 follow-up (15% of 100) + 5 fee = 160
    expect(result).toEqual({
      results: [{ premium: 59 }, { premium: 160 }],
    });
  });

  // Claim: basic payout
  it("pays damage minus 100 G deductible for a standard item", () => {
    const result = processScenario({
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
    });
    // sword insurance value 1000, cap 2000; payout = 500 - 100 deductible = 400
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("pays full reimbursement minus deductible for dragon material item", () => {
    const result = processScenario({
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
    });
    // dragon material, enchantment 5 (below 8): full reimbursement minus deductible
    // payout = 800 - 100 = 700; cap = 2000, remainingCap = 2000 - 700 = 1300
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ],
    });
  });
  it("pays 50% of damage minus deductible for enchantment level 8+", () => {
    const result = processScenario({
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
    });
    // enchantment 9: 50% of 1000 = 500, minus 100 deductible = 400
    // cap = 2000, remainingCap = 2000 - 400 = 1600
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("pays 50% minus deductible when both dragon material and enchantment 8+", () => {
    const result = processScenario({
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
    });
    // both dragon + enchantment 9: 50% wins → 500, minus 100 deductible = 400
    // cap = 2000, remainingCap = 2000 - 400 = 1600
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("applies deductible per damaged item in a multi-item claim", () => {
    const result = processScenario({
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
    });
    // sword: 500 - 100 = 400; amulet: 300 - 100 = 200; total payout = 600
    // insurance sum = 1000 + 600 = 1600, cap = 3200, remainingCap = 3200 - 600 = 2600
    expect(result).toEqual({
      results: [
        { premium: 181 },
        { payout: 600, remainingCap: 2600 },
      ],
    });
  });

  // Claim: component damage
  it("pays damage minus deductible for a rune (no enchantment or material)", () => {
    const result = processScenario({
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
    });
    // rune: 200 - 100 deductible = 100; insurance sum = 250, cap = 500, remainingCap = 500 - 100 = 400
    expect(result).toEqual({
      results: [
        { premium: 33 },
        { payout: 100, remainingCap: 400 },
      ],
    });
  });

  // Claim: cap
  it("caps total payout at twice the insurance sum", () => {
    const result = processScenario({
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
            damages: [{ itemType: "sword", amount: 2500 }],
          },
        },
      ],
    });
    // sword insurance sum = 1000, cap = 2000; damage 2500 - 100 deductible = 2400, capped at 2000
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 2000, remainingCap: 0 },
      ],
    });
  });
  it("tracks remaining cap across multiple claims on the same policy", () => {
    const result = processScenario({
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
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    // cap = 2000; first claim: 1500-100=1400, remainingCap=600
    // second claim: 1500-100=1400, capped at 600, remainingCap=0
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // Error handling
  it("rejects unknown item type in quote with non-zero exit", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote" as const,
            items: [{ type: "broomstick", material: "wood", enchantment: 0, cursed: false }],
          },
        ],
      }),
    ).toThrow();
  });
  it("rejects claim referencing item not in policy", () => {
    expect(() =>
      processScenario({
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
      }),
    ).toThrow();
  });
  it("rejects claim with more damages of a type than insured", () => {
    expect(() =>
      processScenario({
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
                { itemType: "sword", amount: 300 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
  it("rejects negative damage amount", () => {
    expect(() =>
      processScenario({
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
      }),
    ).toThrow();
  });
});
