import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("returns no results for an empty steps array", () => {
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [] });
    expect(result).toEqual({ results: [] });
  });
  it("quotes a single sword for a new customer (base + first-insurance surcharge + processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes each main item type with its own base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
            { type: "staff", material: "oak", enchantment: 0, cursed: false },
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // (100+60+80+40) * 1.10 + 5 = 308 + 5 = 313
    expect(result).toEqual({ results: [{ premium: 313 }] });
  });
  it("applies the 50% cursed surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }],
        },
      ],
    });
    // 100 * 1.5 = 150; * 1.10 = 165; + 5 = 170
    expect(result).toEqual({ results: [{ premium: 170 }] });
  });
  it("applies the 30% high-enchantment surcharge (level >= 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    // 100 * 1.30 = 130; * 1.10 = 143; + 5 = 148
    expect(result).toEqual({ results: [{ premium: 148 }] });
  });
  it("applies the 20% loyalty discount for customers with >= 2 years", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 100 * 1.10 = 110; * 0.80 = 88; + 5 = 93
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("applies the 15% repeat-contract discount on quotes after the first", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // Quote 1 (first insurance): 100 * 1.10 + 5 = 115
    // Quote 2 (repeat -15%):     100 * 0.85 + 5 = 90
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });
  it("prices components below the bundle threshold at 25 G each", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // 2 runes (no bundle): 25 + 25 = 50; * 1.10 = 55; + 5 = 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("prices a bundle of 3 alike components at 60 G base premium", () => {
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
    // bundle of 3 runes: 60; * 1.10 = 66; + 5 = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("rounds the final premium up (in MHPCO's favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 25 * 1.10 = 27.5; + 5 = 32.5; rounded up = 33
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("returns a claim payout of 0 when damage is below the 100 G deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 50 }],
          },
        },
      ],
    });
    // Dragon would fully reimburse 50 G, but minus 100 G deductible = max(0, -50) = 0
    expect(result.results[1]).toEqual({ payout: 0 });
  });
  it("reimburses dragon-material damage in full, minus the deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 300 }],
          },
        },
      ],
    });
    // Dragon -> full 300; minus 100 deductible = 200
    expect(result.results[1]).toEqual({ payout: 200 });
  });
  it("reimburses high-enchantment (level >= 8) damage at 50%, minus the deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 400 }],
          },
        },
      ],
    });
    // 50% of 400 = 200; minus 100 deductible = 100
    expect(result.results[1]).toEqual({ payout: 100 });
  });
  it("returns 0 payout when neither dragon material nor high enchantment applies", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
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
    // No reimbursement applies; gross = 0; after deductible clamp = 0.
    expect(result.results[1]).toEqual({ payout: 0 });
  });
});
