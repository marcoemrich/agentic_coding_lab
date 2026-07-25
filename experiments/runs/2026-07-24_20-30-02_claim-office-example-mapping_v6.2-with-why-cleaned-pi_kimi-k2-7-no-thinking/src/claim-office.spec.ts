import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote tests - ordered simple to complex
  it("should quote an empty item list -- premium 5 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 5 }] });
  });
  it("should quote a single sword -- premium 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote a single amulet -- premium 71 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote a single rune -- premium 33 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 33 }] });
  });
  it("should quote two runes -- premium 60 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 60 }] });
  });
  it("should quote three runes as a block -- premium 71 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote four runes without block -- premium 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote seven runes -- premium 198 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 198 }] });
  });
  it("should quote 2 runes and 1 moonstone as different types -- premium 88 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 88 }] });
  });
  it("should quote 3 runes and 3 moonstones as two separate blocks -- premium 137 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 137 }] });
  });
  it("should quote a cursed sword with 50% curse surcharge -- premium 165 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 165 }] });
  });
  it("should quote a sword with enchantment 5 with 30% high-enchantment surcharge -- premium 145 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 145 }] });
  });
  it("should quote a cursed sword with enchantment 5 with both surcharges -- premium 195 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 195 }] });
  });
  it("should quote a sword for a long-standing customer (>=2 years) with 20% loyalty discount -- premium 95 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 95 }] });
  });
  it("should quote a sword as first insurance with 10% surcharge -- premium 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote a second contract with 15% follow-up discount -- premium 100 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("should apply item-specific modifiers per item and policy-wide modifiers to policy base -- premium 231 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet", cursed: false },
          ],
        },
      ],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 231 }] });
  });
  it("should quote a newcomer with a cursed sword -- premium 165 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 165 }] });
  });
  it("should quote a long-standing customer's second cursed highly-enchanted sword -- premium 160 G (first quote 115 G)", () => {
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });

  // Claim tests
  it("should process a standard claim with deductible -- payout 400 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    expect(processScenario(input)).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should process a claim for a rune with deductible -- payout 100 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    };
    expect(processScenario(input)).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });
  it("should apply 50% reimbursement for enchantment >= 8, then deductible -- payout 400 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    expect(processScenario(input)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should fully reimburse dragon-material damage, then deductible -- payout 700 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    };
    expect(processScenario(input)).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("should choose 50% rule when both high enchantment and dragon material apply -- payout 400 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    expect(processScenario(input)).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("should apply deductible per damaged item in a single incident -- payout 600 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3 },
            { type: "amulet", material: "silver", enchantment: 2 },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    };
    expect(processScenario(input)).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // Policy / cap / validation tests
  it("should cap payout at twice the insurance sum", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 3000 }] },
        },
      ],
    };
    expect(processScenario(input)).toEqual({
      results: [{ premium: 115 }, { payout: 2000, remainingCap: 0 }],
    });
  });
  it("should track remaining cap across successive claims -- payouts 1400 G and 600 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };
    expect(processScenario(input)).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }, { payout: 600, remainingCap: 0 }],
    });
  });
  it("should reject a claim with more damage entries of a type than the policy covers", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    };
    expect(() => processScenario(input)).toThrow();
  });
  it("should reject a quote with an unknown item type", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => processScenario(input)).toThrow();
  });
  it("should reject a claim referencing an item not in the policy", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    expect(() => processScenario(input)).toThrow();
  });
  it("should reject a claim with a negative damage amount", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };
    expect(() => processScenario(input)).toThrow();
  });

  // Rounding tests
  it("should round a premium of 197.5 G up to 198 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 198 }] });
  });
  it("should round a payout of 350.5 G down to 350 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    };
    expect(processScenario(input)).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });
});
