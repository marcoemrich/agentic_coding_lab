import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote — base premiums per item type (first insurance: +10%, +5G fee, round up)
  it("should quote a single sword for a new customer", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote a single amulet for a new customer", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote a single staff for a new customer", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(out).toEqual({ results: [{ premium: 93 }] });
  });
  it("should quote a single potion for a new customer", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
      ],
    });
    // base 40, +10% first = 44, +5 fee = 49
    expect(out).toEqual({ results: [{ premium: 49 }] });
  });
  it("should quote a single component for a new customer", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune", material: "stone", enchantment: 1, cursed: false }],
        },
      ],
    });
    // component base 25, +10% = 27.5, +5 fee = 32.5, ceil 33
    expect(out).toEqual({ results: [{ premium: 33 }] });
  });

  // Component bundle rule
  it("should price a bundle of 3 alike components at the special 60 G base premium", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // bundle 60, +10% = 66, +5 fee = 71
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });

  // Modifiers
  it("should add a 50% surcharge for cursed items", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 * 1.5 = 150, * 1.1 first = 165, +5 = 170
    expect(out).toEqual({ results: [{ premium: 170 }] });
  });
  it("should add a 30% surcharge for highly enchanted items (enchantment >= 5)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    // 100 * 1.3 = 130, * 1.1 first = 143, +5 = 148
    expect(out).toEqual({ results: [{ premium: 148 }] });
  });
  it("should apply a 20% loyalty discount for customers with >= 2 years", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
        },
      ],
    });
    // 100 * 0.8 = 80, * 1.1 first = 88, +5 = 93
    expect(out).toEqual({ results: [{ premium: 93 }] });
  });
  it("should apply a 15% discount on each contract after the first", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 2, cursed: false }],
        },
      ],
    });
    // First: 100 * 1.1 + 5 = 115
    // Second: 100 * 0.85 + 5 = 90 (no first-insurance surcharge)
    expect(out).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });

  // Rounding
  it("should round the premium up to whole G (in MHPCO's favor)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        // First quote (irrelevant for rounding, just to consume "first")
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        // Second quote: cursed sword: 100 * 1.5 * 0.85 + 5 = 132.5 → ceil 133
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: true }],
        },
      ],
    });
    expect(out.results[1]).toEqual({ premium: 133 });
  });

  // Claims
  it("should pay out a basic claim minus the 100 G deductible", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 200 }],
          },
        },
      ],
    });
    // payout = 200 - 100 deductible = 100. Cap = 2 * 600 = 1200; remaining = 1100
    expect(out.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("should reimburse damage to highly enchanted items (>= 8) at 50%", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spell",
            damages: [{ itemType: "amulet", amount: 300 }],
          },
        },
      ],
    });
    // 300 * 0.5 = 150, - 100 deductible = 50; cap 1200 - 50 = 1150
    expect(out.results[1]).toEqual({ payout: 50, remainingCap: 1150 });
  });
  it("should fully reimburse damage to dragon-material items", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // full reimbursement: 500 - 100 deductible = 400; cap 2000 - 400 = 1600
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should cap total payouts at twice the insurance sum and report remaining cap", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 1000 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 800 }] },
        },
      ],
    });
    // Cap = 2 * 600 = 1200
    // Claim 1: 1000 - 100 = 900; cap remaining 300
    // Claim 2: 800 - 100 = 700; capped at 300; cap remaining 0
    expect(out.results[1]).toEqual({ payout: 900, remainingCap: 300 });
    expect(out.results[2]).toEqual({ payout: 300, remainingCap: 0 });
  });
});
