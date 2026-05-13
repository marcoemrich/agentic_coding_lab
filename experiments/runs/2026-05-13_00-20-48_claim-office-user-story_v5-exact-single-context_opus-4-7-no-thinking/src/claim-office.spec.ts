import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote — base premium for a single item type
  it("should quote base premium plus fee for a single plain sword (new customer)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // base 100, +10% initial assessment = 110, +5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote base premium plus fee for a single plain amulet", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // base 60, +10% = 66, +5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote base premium plus fee for a single plain staff", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "oak", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // base 80, +10% = 88, +5 fee = 93
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("should quote base premium plus fee for a single plain potion", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // base 40, +10% = 44, +5 fee = 49
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components
  it("should quote a single rune component at 25 G base premium + fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // base 25, +10% = 27.5 → 28, +5 fee = 33
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("should quote 3 alike components as a building block at 60 G + fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // 3 alike runes = building block: 60 base, +10% = 66, +5 = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  // Surcharges
  it("should add 50% surcharge for a cursed item", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
          ],
        },
      ],
    });
    // base 100, +50% cursed = 150, +10% first insurance = 165, +5 = 170
    expect(result).toEqual({ results: [{ premium: 170 }] });
  });
  it("should add 30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });
    // base 100, +30% = 130, +10% = 143, +5 = 148
    expect(result).toEqual({ results: [{ premium: 148 }] });
  });

  // Discounts
  it("should apply 20% loyalty discount for customers with >= 2 years", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // base 100, +10% first = 110, -20% loyalty = 88, +5 = 93
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("should apply 10% initial assessment surcharge on first insurance but not on subsequent", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // First: base 60, +10% first = 66, +5 = 71
    // Second: no first surcharge, then 15% after-first discount applies (next test)
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("should apply 15% discount on each contract after the first", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // First: 60, +10% = 66, +5 = 71
    // Second: 60, -15% = 51, +5 = 56
    expect(result.results[1]).toEqual({ premium: 56 });
  });

  // Rounding
  it("should round premium to whole G in MHPCO's favor (up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // base 60, +10% first = 66, -20% loyalty = 52.8 → ceil to 53, +5 = 58
    expect(result).toEqual({ results: [{ premium: 58 }] });
  });

  // Claim — base
  it("should pay damage minus 100 G deductible for a basic claim", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // Quote: 115 (from test 1)
    // Claim: damage 500 - 100 deductible = 400 payout
    // Cap = 2 * insurance sum = 2 * 1000 = 2000; remaining = 2000 - 400 = 1600
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it.todo("should cap total payout per policy at twice the insurance sum");
  it.todo("should reimburse 50% of damage for items with enchantment >= 8");
  it.todo("should fully reimburse damage for items made of dragon material");
  it.todo("should track remainingCap across multiple claims");
});
