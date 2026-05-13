import { describe, it, expect } from "vitest";
import { processScenario } from "./scenario.js";

describe("MHPCO Claim Office - Scenario Processing", () => {
  // Base scenario shape
  it("processes an empty scenario to empty results", () => {
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [] };
    expect(processScenario(input)).toEqual({ results: [] });
  });

  // Quote: base premiums per main item type (first contract, 0 years)
  it("quotes a single sword for a new customer", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };
    // 100 base * 1.10 (first insurance surcharge) + 5 processing fee = 115
    expect(processScenario(input)).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a single amulet for a new customer", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    };
    // 60 base * 1.10 + 5 = 71
    expect(processScenario(input)).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a single staff for a new customer", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "wood", enchantment: 1, cursed: false },
          ],
        },
      ],
    };
    // 80 base * 1.10 + 5 = 93
    expect(processScenario(input)).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a single potion for a new customer", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    // 40 base * 1.10 + 5 = 49
    expect(processScenario(input)).toEqual({ results: [{ premium: 49 }] });
  });

  // Quote: components
  it("quotes a single component (rune) at 25 G base premium", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", subtype: "rune", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    // 25 base * 1.10 + 5 = 27.5 + 5 = 32.5 → round up to 33 (MHPCO's favor)
    expect(processScenario(input)).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes three alike components as a 60 G block instead of 75 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", subtype: "rune", enchantment: 0, cursed: false },
            { type: "component", subtype: "rune", enchantment: 0, cursed: false },
            { type: "component", subtype: "rune", enchantment: 0, cursed: false },
          ],
        },
      ],
    };
    // 3 alike components form a block at 60 G base (not 75 G).
    // 60 * 1.10 + 5 = 66 + 5 = 71
    expect(processScenario(input)).toEqual({ results: [{ premium: 71 }] });
  });

  // Quote: risk surcharges
  it("applies 50% cursed surcharge to a cursed item", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    };
    // 100 * 1.5 (cursed) = 150, * 1.10 (first ins) = 165, + 5 = 170
    expect(processScenario(input)).toEqual({ results: [{ premium: 170 }] });
  });
  it("applies 30% high-enchantment surcharge to items with enchantment >= 5", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    };
    // 100 * 1.30 = 130, * 1.10 = 143, + 5 = 148
    expect(processScenario(input)).toEqual({ results: [{ premium: 148 }] });
  });

  // Quote: customer discounts/surcharges
  it("applies 20% loyalty discount to a customer with >= 2 years", () => {
    const input = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
      ],
    };
    // 100 * 1.10 (first ins) = 110, * 0.80 (loyalty) = 88, + 5 = 93
    expect(processScenario(input)).toEqual({ results: [{ premium: 93 }] });
  });
  it("applies 15% multi-contract discount on the second contract instead of first-insurance surcharge", () => {
    const input = {
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
    };
    // 1st contract: 100 * 1.10 + 5 = 115
    // 2nd contract: 100 * 0.85 + 5 = 85 + 5 = 90
    expect(processScenario(input)).toEqual({
      results: [{ premium: 115 }, { premium: 90 }],
    });
  });

  // Quote: rounding in MHPCO's favor (round up)
  it("rounds the premium up in MHPCO's favor", () => {
    // A cursed potion: 40 * 1.5 = 60, * 1.10 = 66, + 5 = 71. Integer, boring.
    // Use a cursed component: 25 * 1.5 = 37.5, * 1.10 = 41.25 → round up 42, + 5 = 47.
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "component", subtype: "moonstone", enchantment: 0, cursed: true },
          ],
        },
      ],
    };
    expect(processScenario(input)).toEqual({ results: [{ premium: 47 }] });
  });

  // Claim: basic mechanics
  it("pays a claim minus the 100 G deductible", () => {
    const input = {
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
    };
    // Amulet insurance: 600 → cap = 1200.
    // Damage 200 - 100 deductible = 100 payout. Remaining cap: 1200 - 100 = 1100.
    const result = processScenario(input) as { results: unknown[] };
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
  });
  it("pays zero when damage is at or below the deductible", () => {
    const input = {
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
            cause: "scuff",
            damages: [{ itemType: "amulet", amount: 50 }],
          },
        },
      ],
    };
    const result = processScenario(input) as { results: unknown[] };
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 1200 });
  });
  it("caps payout at twice the insurance sum", () => {
    const input = {
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
            cause: "disaster",
            damages: [{ itemType: "amulet", amount: 5000 }],
          },
        },
      ],
    };
    // Insurance 600 → cap 1200. Damage 5000 - 100 = 4900, but capped at 1200.
    const result = processScenario(input) as { results: unknown[] };
    expect(result.results[1]).toEqual({ payout: 1200, remainingCap: 0 });
  });

  // Claim: special reimbursement rules
  it("reimburses only 50% of damage for highly enchanted items (enchantment >= 8)", () => {
    const input = {
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
            cause: "shatter",
            damages: [{ itemType: "sword", amount: 600 }],
          },
        },
      ],
    };
    // 50% damage reimbursement: 600 * 0.5 = 300, - 100 deductible = 200 payout.
    // Sword insurance 1000 → cap 2000, remaining 1800.
    const result = processScenario(input) as { results: unknown[] };
    expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("fully reimburses damage to dragon-material items", () => {
    const input = {
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "battle",
            damages: [{ itemType: "sword", amount: 600 }],
          },
        },
      ],
    };
    // Dragon material: fully reimbursed (overrides 50% enchantment rule).
    // Payout: 600 (no enchantment haircut, but deductible still applies) - 100 = 500.
    // Cap: 1000 * 2 = 2000, remaining = 1500.
    const result = processScenario(input) as { results: unknown[] };
    expect(result.results[1]).toEqual({ payout: 500, remainingCap: 1500 });
  });

  // Claim: cap tracking across multiple claims
  it("tracks remaining cap across multiple claims on the same policy", () => {
    const input = {
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
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "spell mishap",
            damages: [{ itemType: "amulet", amount: 250 }],
          },
        },
      ],
    };
    // Cap starts at 1200.
    // First claim: 200 - 100 = 100 payout, remainingCap 1100.
    // Second claim: 250 - 100 = 150 payout, remainingCap 950.
    const result = processScenario(input) as { results: unknown[] };
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1100 });
    expect(result.results[2]).toEqual({ payout: 150, remainingCap: 950 });
  });
});
