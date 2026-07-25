import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Basic quotes
  it("should quote an empty item list at 5 G -- only the processing fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("should quote a single sword at 115 G -- 100 G base + 10 G first insurance + 5 G fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote a single amulet at 71 G -- 60 G base + 6 G first insurance + 5 G fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote a single staff at 93 G -- 80 G base + 8 G first insurance + 5 G fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("should quote a single potion at 49 G -- 40 G base + 4 G first insurance + 5 G fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("should quote a single rune at 33 G -- 25 G base + 3 G first insurance + 5 G fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("should quote a single moonstone at 33 G -- 25 G base + 3 G first insurance + 5 G fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // Component blocks
  it("should quote 2 runes at 60 G -- 50 G base + 5 G first insurance + 5 G fee (no block)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("should quote 3 runes at 71 G -- 60 G block base + 6 G first insurance + 5 G fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote 4 runes at 115 G -- 100 G base + 10 G first insurance + 5 G fee (block requires exactly 3)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote 7 runes at 198 G -- 175 G base + 18 G first insurance + 5 G fee", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("should quote 2 runes + 1 moonstone at 88 G -- 75 G base + 8 G first insurance + 5 G fee (different types)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("should quote 3 runes + 3 moonstones at 137 G -- 120 G base + 12 G first insurance + 5 G fee (two separate blocks)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Item modifiers
  it("should apply a 50% cursed surcharge to a cursed sword -- premium 165 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", cursed: true }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("should apply a 30% high-enchantment surcharge for enchantment >= 5 -- premium 145 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", enchantment: 5 }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("should not apply high-enchantment surcharge for enchantment 4 -- premium 115 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", enchantment: 4 }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should apply both cursed and high-enchantment surcharges when both apply -- premium 195 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", cursed: true, enchantment: 5 }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // Customer and contract modifiers
  it("should apply a 20% loyalty discount for customers with >= 2 years", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{
        op: "quote",
        items: [{ type: "sword" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("should apply a 10% first-insurance surcharge", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword" }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should apply a 15% follow-up contract discount after the first contract", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // Integration examples
  it("should quote a newcomer with a cursed sword at 165 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("should quote a long-standing customer's second contract with a cursed highly-enchanted sword at 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 59 }, { premium: 160 }] });
  });

  // Multi-item policies
  it("should apply item-specific cursed surcharge only to the cursed item -- cursed sword + plain amulet = 231 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Claims
  it("should pay out 400 G for regular sword damage 500 G after 100 G deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "scratch",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("should pay out 100 G for rune damage 200 G after 100 G deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "drop",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }] });
  });
  it("should fully reimburse a dragon-material sword -- 700 G for damage 800 G after 100 G deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "bite",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }] });
  });
  it("should reimburse 50% for an item with enchantment >= 8 -- 400 G for damage 1000 G after 100 G deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "shock",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("should apply the 50% enchantment rule when both dragon material and enchantment >= 8 apply -- 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "blast",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }] });
  });
  it("should apply the 100 G deductible per damaged item -- 600 G for sword 500 G + amulet 300 G", () => {
    const result = processScenario({
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
    });
    expect(result).toEqual({ results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }] });
  });

  // Caps and multiple items
  it("should compute insurance sum 2000 G and cap 4000 G for two swords", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "theft",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }] });
  });
  it("should treat each damage entry as a separate damage with its own deductible", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }, { itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }] });
  });
  it("should reduce payout to remaining cap when cap is exhausted -- first 1400 G, then 600 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "flood",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "quake",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // Error cases
  it("should reject a claim with more damage entries than insured items", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "attack",
              damages: [
                { itemType: "sword", amount: 100 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      })
    ).toThrow();
  });
  it("should exit non-zero for an unknown item type in a quote", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })
    ).toThrow();
  });
  it("should exit non-zero for an unknown item type in a claim", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "attack",
              damages: [{ itemType: "broomstick", amount: 100 }],
            },
          },
        ],
      })
    ).toThrow();
  });
  it("should exit non-zero for a negative damage amount", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "attack",
              damages: [{ itemType: "sword", amount: -200 }],
            },
          },
        ],
      })
    ).toThrow();
  });

  // Rounding
  it("should round a premium up in MHPCO favor -- 197.5 G becomes 198 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "rune" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("should round a payout down in MHPCO favor -- 350.5 G becomes 350 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "magic surge",
            damages: [{ itemType: "sword", amount: 901 }],
          },
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }] });
  });
});
