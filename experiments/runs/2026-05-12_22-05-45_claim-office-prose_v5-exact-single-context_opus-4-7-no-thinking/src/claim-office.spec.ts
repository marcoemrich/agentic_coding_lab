import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Base item premiums (with first-insurance +10%, +5G fee, new customer 0 years)
  it("quotes a single sword for a new customer", () => {
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
    // 100 base * 1.10 first-insurance + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a single amulet for a new customer", () => {
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
    // 60 base * 1.10 + 5 = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a single staff for a new customer", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "oak", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // 80 * 1.10 = 88 + 5 = 93
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a single potion for a new customer", () => {
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
    // 40 * 1.10 = 44 + 5 = 49
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes a single rune component for a new customer", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // 25 * 1.10 = 27.5 → 28 + 5 = 33
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // Multiple items
  it("quotes multiple distinct items by summing their base premiums", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
            { type: "amulet", material: "silver", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // (100 + 60) * 1.10 = 176 + 5 = 181
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });
  it("quotes three alike components as a building block at 60G base", () => {
    const result = runScenario({
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
    // Block of 3 alike → 60 base. 60 * 1.10 = 66 + 5 = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes four alike components as one block (60G) plus one single (25G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // 60 + 25 = 85. 85 * 1.10 = 93.5 → 94 + 5 = 99
    expect(result).toEqual({ results: [{ premium: 99 }] });
  });

  // Modifiers on items
  it("adds 50% surcharge for cursed items", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: true },
          ],
        },
      ],
    });
    // 100 * 1.5 = 150 → * 1.10 = 165 + 5 = 170
    expect(result).toEqual({ results: [{ premium: 170 }] });
  });
  it("adds 30% surcharge for enchantment level >= 5", () => {
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
    // 100 * 1.30 = 130 * 1.10 = 143 + 5 = 148
    expect(result).toEqual({ results: [{ premium: 148 }] });
  });

  // Customer-level modifiers
  it("applies 20% loyalty discount for customers with >= 2 years", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // 100 * 1.10 (first) = 110 * 0.80 (loyalty) = 88 + 5 = 93
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("applies 15% discount on contracts after the first", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // Q1: 100 * 1.10 + 5 = 115. Q2: 100 * 0.85 = 85 + 5 = 90
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });

  // Rounding in MHPCO favor (up)
  it("rounds the final premium up to whole G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // 40 * 1.10 = 44 * 0.80 = 35.2 → ceil 36 + 5 = 41
    expect(result).toEqual({ results: [{ premium: 41 }] });
  });

  // Claims
  it("processes a basic claim with 100G deductible", () => {
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
    // Insurance sum 600. Cap = 1200. Payout = 200 - 100 deductible = 100.
    // RemainingCap = 1200 - 100 = 1100.
    const r = result as { results: Array<Record<string, number>> };
    expect(r.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("reimburses 50% for damage to items with enchantment >= 8", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "oak", enchantment: 10, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "blast",
            damages: [{ itemType: "staff", amount: 400 }],
          },
        },
      ],
    });
    // 400 damage * 50% (high enchantment) = 200, minus 100 deductible = 100 payout.
    // Cap was 1600 → 1500 remaining.
    const r = result as { results: Array<Record<string, number>> };
    expect(r.results[1]).toEqual({ payout: 100, remainingCap: 1500 });
  });
  it("fully reimburses damage to items made of dragon material", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fall",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // Dragon: fully reimbursed (no deductible). Payout 500. Cap 2000 → 1500.
    const r = result as { results: Array<Record<string, number>> };
    expect(r.results[1]).toEqual({ payout: 500, remainingCap: 1500 });
  });
  it("caps total payout at twice the insurance sum across claims", () => {
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
            damages: [{ itemType: "amulet", amount: 1500 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spell",
            damages: [{ itemType: "amulet", amount: 500 }],
          },
        },
      ],
    });
    // Cap = 2 * 600 = 1200.
    // Claim 1: 1500 - 100 = 1400 → capped to 1200, remaining 0.
    // Claim 2: anything → capped to 0, remaining 0.
    const r = result as { results: Array<Record<string, number>> };
    expect(r.results[1]).toEqual({ payout: 1200, remainingCap: 0 });
    expect(r.results[2]).toEqual({ payout: 0, remainingCap: 0 });
  });
});
