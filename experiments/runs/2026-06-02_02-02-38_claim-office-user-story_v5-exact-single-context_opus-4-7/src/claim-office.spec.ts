import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Shape / skeleton
  it("an empty steps array returns an empty results array", () => {
    const out = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [] });
    expect(out).toEqual({ results: [] });
  });

  // Quoting — main items
  it("a quote for a single plain sword (brand-new customer, first contract) returns 115 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    });
    // 100 (sword base) × 1.10 (first contract) = 110 + 5 (fee) = 115
    expect(out).toEqual({ results: [{ premium: 115 }] });
  });
  it("a quote for several main items sums their base premiums", () => {
    const out = runScenario({
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
    // (100 + 60) × 1.10 + 5 = 176 + 5 = 181
    expect(out).toEqual({ results: [{ premium: 181 }] });
  });

  // Quoting — components
  it("a quote for a single component uses the per-component base premium", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune", enchantment: 1, cursed: false }] },
      ],
    });
    // 25 (rune base) × 1.10 (first contract) = 27.5 → ceil 28 + 5 fee = 33
    expect(out).toEqual({ results: [{ premium: 33 }] });
  });
  it("a quote for three alike components uses the bundle premium of 60 G", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", enchantment: 1, cursed: false },
            { type: "rune", enchantment: 1, cursed: false },
            { type: "rune", enchantment: 1, cursed: false },
          ],
        },
      ],
    });
    // Bundle 60 G × 1.10 = 66 + 5 fee = 71  (cheaper than 3×25 = 75)
    expect(out).toEqual({ results: [{ premium: 71 }] });
  });

  // Quoting — per-item risk surcharges
  it("cursed items add a 50% risk surcharge", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: true }] },
      ],
    });
    // 100 × 1.50 (cursed) = 150 × 1.10 (first contract) = 165 + 5 = 170
    expect(out).toEqual({ results: [{ premium: 170 }] });
  });
  it("items with enchantment >= 5 add a 30% risk surcharge", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    });
    // 100 × 1.30 (high enchantment) = 130 × 1.10 (first contract) = 143 + 5 = 148
    expect(out).toEqual({ results: [{ premium: 148 }] });
  });

  // Quoting — customer-level adjustments
  it("long-standing customers (>= 2 years with MHPCO) receive a 20% loyalty discount", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
      ],
    });
    // 100 × 1.10 (first contract) × 0.80 (loyalty) = 88 + 5 fee = 93
    expect(out).toEqual({ results: [{ premium: 93 }] });
  });
  // Note: the 10% initial-assessment surcharge is exercised by the single-sword
  // (115 G) and loyalty-discount (93 G) tests above. Test it explicitly via its
  // counterpart: contracts after the first get a 15% discount instead.
  it("each contract after the first receives a 15% discount", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
      ],
    });
    // step 0: first contract → 100 × 1.10 + 5 = 115
    // step 1: after first → 100 × 0.85 = 85 + 5 = 90
    expect(out).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });

  // Quoting — rounding
  // Note: round-up-in-MHPCO's-favor is already exercised by the single-rune
  // test above (25 × 1.10 = 27.5 → 28 → +5 = 33). A standalone test would
  // be redundant and could not start red.

  // Claims — basic
  it("a claim subtracts a 100 G deductible from the damage amount", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
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
    // sword insurance value 1000 → cap 2000. damage 300 - 100 deductible = 200 payout.
    // remainingCap after one claim: 2000 - 200 = 1800.
    expect(out.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("the total payout per policy is capped at twice the insurance sum", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [{ itemType: "sword", amount: 5000 }],
          },
        },
      ],
    });
    // sword insurance = 1000, cap = 2 × 1000 = 2000.
    // damage 5000 - 100 = 4900 raw, clamped to cap 2000. remainingCap = 0.
    expect(out.results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("damage to items with enchantment >= 8 is reimbursed at 50%", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "lightning",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // damage 500 → 50% reimbursable (enchant 8) = 250; - 100 deductible = 150 payout.
    // cap = 2000, remainingCap = 1850.
    expect(out.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
  });
  it("damage to dragon-material items is fully reimbursed (overrides high-enchantment halving)", () => {
    const out = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
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
    // Dragon material → full reimbursement. damage 500 - 100 deductible = 400 payout. remainingCap = 1600.
    expect(out.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("remainingCap decreases across successive claims on the same policy (schema example 2)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spell mishap", damages: [{ itemType: "amulet", amount: 250 }] },
        },
      ],
    });
    // Quote: amulet 60 × 1.10 (first contract) × 0.80 (loyalty 5y) = 52.8 → ceil 53 + 5 = 58.
    // Cap: 2 × 600 = 1200.
    // Claim 1: 200 − 100 = 100 payout. remainingCap = 1100.
    // Claim 2: 250 − 100 = 150 payout. remainingCap = 950.
    expect(out).toEqual({
      results: [
        { premium: 58 },
        { payout: 100, remainingCap: 1100 },
        { payout: 150, remainingCap: 950 },
      ],
    });
  });
});
