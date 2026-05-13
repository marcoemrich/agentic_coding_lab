import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office — quote", () => {
  it("quotes a single sword for a brand-new customer (base + first-insurance surcharge + processing fee)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // Base sword premium 100 G; first-insurance surcharge +10% → 110; +5 G processing fee → 115 G.
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes each main item type at its base premium (amulet, staff, potion)", () => {
    const amulet = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] }],
    });
    // 60 × 1.10 (first insurance) = 66 → +5 fee = 71
    expect(amulet).toEqual({ results: [{ premium: 71 }] });

    const staff = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }] }],
    });
    // 80 × 1.10 = 88 → +5 fee = 93
    expect(staff).toEqual({ results: [{ premium: 93 }] });

    const potion = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
    });
    // 40 × 1.10 = 44 → +5 fee = 49
    expect(potion).toEqual({ results: [{ premium: 49 }] });
  });
  it("quotes a single component at 25 G base premium", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 25 × 1.10 = 27.5 → ceil 28 → +5 fee = 33
    expect(output).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes a block of 3 alike components at the 60 G special base premium", () => {
    const output = runScenario({
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
    // 3 alike components form a block: 60 G × 1.10 first = 66 → +5 fee = 71
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("adds a 50% surcharge for a cursed item", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: true }] },
      ],
    });
    // sword 100 × 1.50 cursed = 150 → × 1.10 first = 165 → +5 fee = 170
    expect(output).toEqual({ results: [{ premium: 170 }] });
  });
  it("adds a 30% surcharge for an item with enchantment >= 5", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    });
    // sword 100 × 1.30 high-enchant = 130 → × 1.10 first = 143 → +5 fee = 148
    expect(output).toEqual({ results: [{ premium: 148 }] });
  });
  it("applies a 20% loyalty discount for customers with >= 2 years of business", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ],
    });
    // 100 × 0.80 loyalty × 1.10 first = 88 → +5 fee = 93
    expect(output).toEqual({ results: [{ premium: 93 }] });
  });
  it("applies a 15% discount on contracts after the customer's first", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
      ],
    });
    // Step 0 (first contract): 100 × 1.10 = 110 → +5 = 115
    // Step 1 (subsequent contract): 100 × 0.85 = 85 → +5 = 90
    expect(output).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });
  it("rounds the premium up (in MHPCO's favor)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        { op: "quote", items: [{ type: "staff", material: "oak", enchantment: 0, cursed: false }] },
      ],
    });
    // Step 1: staff 80 × 0.80 loyalty × 0.85 subsequent = 54.4 → must round UP to 55 → +5 fee = 60
    expect(output.results[1]).toEqual({ premium: 60 });
  });
});

describe("MHPCO Claim Office — claim", () => {
  it("pays out claim amount minus 100 G deductible per incident", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
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
    // sword insured at 1000 G → cap 2× = 2000 G.
    // damage 300 − 100 deductible = 200 payout; remaining cap = 2000 − 200 = 1800.
    expect(output.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("pays out 0 (not negative) when the deductible exceeds the damage", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "scratch",
            damages: [{ itemType: "sword", amount: 50 }],
          },
        },
      ],
    });
    // 50 damage − 100 deductible would be negative; payout clamps to 0, cap untouched.
    expect(output.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("reimburses items with enchantment >= 8 at only 50% of damage", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "lightning",
            damages: [{ itemType: "sword", amount: 300 }],
          },
        },
      ],
    });
    // 300 × 0.5 (high enchantment) = 150 reimbursable → 150 − 100 deductible = 50 payout.
    // cap 2000 − 50 = 1950 remainingCap.
    expect(output.results[1]).toEqual({ payout: 50, remainingCap: 1950 });
  });
  it("fully reimburses items made of dragon material", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon's breath",
            damages: [{ itemType: "sword", amount: 300 }],
          },
        },
      ],
    });
    // Dragon material overrides high-enchant 50% cut: 300 × 1.0 = 300 reimbursable → −100 deductible = 200 payout.
    expect(output.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("caps cumulative payout at twice the insurance sum", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1600 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "rust", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // Cap = 2 × 1000 = 2000.
    // Claim 1: 1600 − 100 = 1500 payout → remainingCap = 500.
    // Claim 2: 1000 − 100 = 900 requested, but only 500 left in cap → payout = 500, remainingCap = 0.
    expect(output.results[1]).toEqual({ payout: 1500, remainingCap: 500 });
    expect(output.results[2]).toEqual({ payout: 500, remainingCap: 0 });
  });
});

describe("MHPCO Claim Office — scenarios", () => {
  it("handles the schema example 1 (single quote)", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    // sword 100; enchant 3 (<5) no surcharge; not cursed; no loyalty (0y);
    // first insurance × 1.10 = 110 → +5 fee = 115.
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("handles the schema example 2 (quote followed by two claims) with correct remainingCap", () => {
    const output = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spell mishap", damages: [{ itemType: "amulet", amount: 250 }] },
        },
      ],
    });
    // Quote: amulet base 60; no surcharges; loyalty (5y) ×0.80 = 48; first ×1.10 = 52.8 → ceil 53 → +5 fee = 58.
    // Cap = 2 × 600 = 1200.
    // Claim 1: 200 reimbursable − 100 = 100 payout → remainingCap 1100.
    // Claim 2: 250 reimbursable − 100 = 150 payout → remainingCap 950.
    expect(output).toEqual({
      results: [
        { premium: 58 },
        { payout: 100, remainingCap: 1100 },
        { payout: 150, remainingCap: 950 },
      ],
    });
  });
});
