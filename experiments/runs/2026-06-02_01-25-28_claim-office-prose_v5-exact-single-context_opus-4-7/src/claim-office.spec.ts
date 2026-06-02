import { describe, it, expect } from "vitest";
import { evaluate } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Quote: base functionality
  it("returns an empty results array for an empty steps list", () => {
    const result = evaluate({
      customer: { yearsWithMHPCO: 0 },
      steps: [],
    });
    expect(result).toEqual({ results: [] });
  });
  it("quotes a single sword for a brand-new customer (base + first-insurance surcharge + processing fee)", () => {
    const result = evaluate({
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
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("sums base premiums for multiple main items in a single quote", () => {
    const result = evaluate({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 181 }] });
  });
  it("prices a single component (rune) using the per-component price", () => {
    const result = evaluate({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "granite", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("prices a block of three alike components using the special block price", () => {
    const result = evaluate({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "granite", enchantment: 0, cursed: false },
            { type: "rune", material: "granite", enchantment: 0, cursed: false },
            { type: "rune", material: "granite", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  // Quote: per-item modifiers
  it("adds a 50% surcharge for a cursed item", () => {
    const result = evaluate({
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
    expect(result).toEqual({ results: [{ premium: 170 }] });
  });
  it("adds a 30% surcharge for a highly enchanted item (enchantment >= 5)", () => {
    const result = evaluate({
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
    expect(result).toEqual({ results: [{ premium: 148 }] });
  });

  // Quote: customer / contract modifiers
  it("applies a 20% loyalty discount for customers with >= 2 years", () => {
    const result = evaluate({
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
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("applies a 15% subsequent-contract discount instead of the first-insurance surcharge on later quotes", () => {
    const result = evaluate({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 90 }],
    });
  });

  // Quote: rounding
  it("rounds the premium up to the next whole G (MHPCO's favor)", () => {
    // 100 * 1.3 (enchantment>=5) * 0.8 (loyalty) * 1.10 (first insurance) = 114.4
    // Round UP -> 115; + 5 fee = 120. (Nearest-rounding would give 114 + 5 = 119.)
    const result = evaluate({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 120 }] });
  });

  // Claim: base functionality
  it("applies a 100 G deductible to a simple claim and reduces remainingCap by the payout", () => {
    const result = evaluate({
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
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("reimburses 50% of the damage amount for items with enchantment >= 8", () => {
    const result = evaluate({
      customer: { yearsWithMHPCO: 0 },
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
            cause: "fireball",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 148 },
        { payout: 150, remainingCap: 1850 },
      ],
    });
  });
  it("reimburses 100% of the damage amount for items made of dragon material", () => {
    // Dragon material overrides the enchantment >= 8 half-reimbursement rule.
    const result = evaluate({
      customer: { yearsWithMHPCO: 0 },
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
            cause: "siege",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 148 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("caps payout at twice the insurance sum", () => {
    // Sword insurance sum = 1000, cap = 2000. Damage 2500 - 100 deductible = 2400 naive,
    // capped at 2000. remainingCap = 0 after this claim.
    const result = evaluate({
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
            cause: "catastrophe",
            damages: [{ itemType: "sword", amount: 2500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 2000, remainingCap: 0 },
      ],
    });
  });
  it("shares one cap across multiple claims on the same policy", () => {
    // Sword cap = 2000. After 700 payout, remainingCap = 1300. A second 1400-naive
    // payout is then capped at 1300, exhausting the policy.
    const result = evaluate({
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
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "flood",
            damages: [{ itemType: "sword", amount: 1500 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 700, remainingCap: 1300 },
        { payout: 1300, remainingCap: 0 },
      ],
    });
  });
});
