import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote base premiums (per price list)
  it("should quote base premium for a single sword (new customer, first contract)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    // sword base 100 G + 10% first-insurance surcharge = 110 + 5 G fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("should quote base premium for a single amulet", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    // amulet base 60 G * 1.10 first-insurance = 66 + 5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("should quote base premium for a single staff", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "oak", enchantment: 2, cursed: false },
          ],
        },
      ],
    });
    // staff base 80 * 1.10 = 88 + 5 = 93
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("should quote base premium for a single potion", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // potion base 40 * 1.10 = 44 + 5 = 49
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("should quote base premium for a single component (rune)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", kind: "component", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // rune base 25 * 1.10 = 27.5 -> 28 + 5 = 33
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("should quote a building block of 3 alike components at special premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", kind: "component", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", kind: "component", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", kind: "component", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // 3 alike runes -> special base 60 * 1.10 = 66 + 5 = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  // Quote modifiers
  it("should apply 50% cursed surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });
    // sword base 100 * 1.50 cursed = 150 * 1.10 first-insurance = 165 + 5 = 170
    expect(result).toEqual({ results: [{ premium: 170 }] });
  });
  it("should apply 30% high-enchantment surcharge (enchantment >= 5)", () => {
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
    // 100 * 1.30 enchantment = 130 * 1.10 first-insurance = 143 + 5 = 148
    expect(result).toEqual({ results: [{ premium: 148 }] });
  });
  it("should apply 20% loyalty discount for customers with >= 2 years", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    // base 100, loyalty -20% = 80, first-insurance +10% = 88, +5 fee = 93
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("should apply 15% discount on each contract after the first", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    });
    // Quote 1: 100 + 10% first-insurance = 110 + 5 = 115
    // Quote 2: 100 * 0.85 subsequent = 85 + 5 = 90 (no first-insurance)
    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 90 }],
    });
  });

  // Claims
  it("should pay claim amount minus 100 G deductible for ordinary damage", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
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
    // Amulet insured at 600 G, cap = 1200 G.
    // Damage 200 - deductible 100 = 100 G payout. Remaining cap = 1100.
    const r = result.results;
    expect(r[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("should reimburse 50% for damage to highly enchanted items (enchantment >= 8)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 400 }],
          },
        },
      ],
    });
    // Sword ench=8: damage 400 * 0.5 = 200, minus deductible 100 = 100 payout.
    // Cap = 1000 * 2 = 2000, remaining = 1900.
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("should fully reimburse damage to dragon material items", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 9, cursed: false },
          ],
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
    // Dragon material: fully reimbursed, overriding the high-ench 50% rule.
    // 500 - 100 deductible = 400 payout. Cap = 2000, remaining = 1600.
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("should cap total payout per policy at twice the insurance sum", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "catastrophe",
            damages: [{ itemType: "amulet", amount: 2000 }],
          },
        },
      ],
    });
    // Amulet insured at 600 G, cap = 1200 G.
    // Damage 2000 - 100 deductible = 1900, capped at 1200. Remaining = 0.
    expect(result.results[1]).toEqual({ payout: 1200, remainingCap: 0 });
  });
});
