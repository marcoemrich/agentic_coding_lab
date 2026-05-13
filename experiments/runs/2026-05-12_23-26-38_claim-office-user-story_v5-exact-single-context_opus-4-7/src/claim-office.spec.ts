import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

const quoteSingleItem = (
  customer: { yearsWithMHPCO: number },
  item: { type: string; material: string; enchantment: number; cursed: boolean },
) =>
  processScenario({
    customer,
    steps: [{ op: "quote", items: [item] }],
  });

describe("MHPCO Claim Office", () => {
  // Quoting: main items
  it("returns empty results for empty steps", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [] });
    expect(result).toEqual({ results: [] });
  });
  it("quotes a single sword for a new customer's first contract", () => {
    const result = quoteSingleItem(
      { yearsWithMHPCO: 0 },
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
    );
    // sword base 100 × 1.10 (first insurance) + 5 (fee) = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes a single amulet for a new customer's first contract", () => {
    const result = quoteSingleItem(
      { yearsWithMHPCO: 0 },
      { type: "amulet", material: "silver", enchantment: 0, cursed: false },
    );
    // amulet base 60 × 1.10 + 5 = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a single staff for a new customer's first contract", () => {
    const result = quoteSingleItem(
      { yearsWithMHPCO: 0 },
      { type: "staff", material: "oak", enchantment: 0, cursed: false },
    );
    // staff base 80 × 1.10 + 5 = 93
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a single potion for a new customer's first contract", () => {
    const result = quoteSingleItem(
      { yearsWithMHPCO: 0 },
      { type: "potion", material: "glass", enchantment: 0, cursed: false },
    );
    // potion base 40 × 1.10 + 5 = 49
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Quoting: components
  it("quotes a single component at the 25G component base premium", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", category: "component", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // component base 25 × 1.10 + 5 = 32.5 → 33 (round up in MHPCO's favor)
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes a building block of 3 alike components at the special 60G base premium", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", category: "component", enchantment: 0, cursed: false },
            { type: "rune", category: "component", enchantment: 0, cursed: false },
            { type: "rune", category: "component", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // 3 alike components form a building block: base 60G × 1.10 + 5 = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });

  // Quoting: surcharges
  it("applies a 50% risk surcharge to cursed items", () => {
    const result = quoteSingleItem(
      { yearsWithMHPCO: 0 },
      { type: "sword", material: "steel", enchantment: 0, cursed: true },
    );
    // cursed sword: 100 × 1.50 (curse) × 1.10 (first insurance) + 5 (fee) = 170
    expect(result).toEqual({ results: [{ premium: 170 }] });
  });
  it("applies a 30% risk surcharge to highly enchanted items (level >= 5)", () => {
    const result = quoteSingleItem(
      { yearsWithMHPCO: 0 },
      { type: "sword", material: "steel", enchantment: 5, cursed: false },
    );
    // highly enchanted sword: 100 × 1.30 × 1.10 + 5 = 148
    expect(result).toEqual({ results: [{ premium: 148 }] });
  });

  // Quoting: customer-level adjustments
  it("applies a 20% loyalty discount for customers with >= 2 years of business", () => {
    const result = quoteSingleItem(
      { yearsWithMHPCO: 2 },
      { type: "sword", material: "steel", enchantment: 0, cursed: false },
    );
    // sword 100 × 1.10 (first insurance) × 0.80 (loyalty) + 5 = 93
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("applies a 10% initial assessment surcharge on the customer's first insurance", () => {
    // Two quote steps for the same customer: only the first carries the +10% initial assessment surcharge.
    const result = processScenario({
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
    // First contract: 100 × 1.10 (initial assessment) + 5 = 115
    expect(result.results[0]).toEqual({ premium: 115 });
    // Second contract is not a first insurance, so it does NOT carry the +10% surcharge.
    expect(result.results[1].premium).toBeLessThan(115);
  });
  it("applies a 15% discount on each contract after the first", () => {
    const result = processScenario({
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
    // Second contract: 100 × 0.85 (subsequent-contract discount) + 5 = 90
    expect(result.results[1]).toEqual({ premium: 90 });
  });

  // Quoting: rounding and fee
  it("rounds the final premium up to whole G (in MHPCO's favor) and adds the 5G processing fee", () => {
    const result = quoteSingleItem(
      { yearsWithMHPCO: 2 },
      { type: "amulet", material: "silver", enchantment: 5, cursed: false },
    );
    // 60 × 1.30 (high enchantment) × 1.10 (first insurance) × 0.80 (loyalty) = 68.64
    //   round up in MHPCO's favor → 69
    //   add 5G processing fee → 74
    expect(result).toEqual({ results: [{ premium: 74 }] });
  });

  // Claims
  it("processes a claim with a 100G deductible per damage event", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    // Sword insurance value 1000G → cap 2 × 1000 = 2000G.
    // Damage 200G − 100G deductible = 100G payout.
    // Remaining cap: 2000 − 100 = 1900.
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("caps total payout per policy at twice the insurance sum", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "amulet", amount: 2000 }],
          },
        },
      ],
    });
    // Amulet insurance 600 → cap 2 × 600 = 1200.
    // 2000 − 100 deductible = 1900 would-be payout, clamped to remaining 1200.
    expect(result.results[1]).toEqual({ payout: 1200, remainingCap: 0 });
  });
  it("reimburses damage to items with enchantment >= 8 at 50% of the damage amount", () => {
    const result = processScenario({
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
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // Item enchantment ≥ 8 → reimburse at 50%: 500 × 0.5 = 250 covered damage.
    // Per-event deductible 100 → payout 150. Cap 2000 − 150 = 1850.
    expect(result.results[1]).toEqual({ payout: 150, remainingCap: 1850 });
  });
  it("fully reimburses damage to items made of dragon material", () => {
    const result = processScenario({
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
            damages: [{ itemType: "sword", amount: 200 }],
          },
        },
      ],
    });
    // Dragon material → fully reimbursed (no deductible): payout 200.
    // Cap 2 × 1000 = 2000 → remaining 1800.
    expect(result.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
});
