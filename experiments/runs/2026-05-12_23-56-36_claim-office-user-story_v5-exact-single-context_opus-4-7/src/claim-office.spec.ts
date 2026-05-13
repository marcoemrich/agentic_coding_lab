import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  it("returns empty results for a scenario with no steps", () => {
    const result = processScenario({ customer: { yearsWithMHPCO: 0 }, steps: [] });
    expect(result).toEqual({ results: [] });
  });
  it("quotes a single sword for a brand new customer (base + first-insurance surcharge + fee)", () => {
    // Brand new customer (yearsWithMHPCO=0, first contract):
    //   base 100 + 10% first-insurance = 110, + 5 G fee = 115
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quotes the other main item types with their base premiums", () => {
    // For a brand-new customer (yearsWithMHPCO=0): each quote is a first contract.
    // amulet: 60 * 1.10 + 5 = 71; staff: 80 * 1.10 + 5 = 93; potion: 40 * 1.10 + 5 = 49.
    // (Each step is independent here — we'll test multi-contract discount later.)
    const baseItem = { material: "any", enchantment: 0, cursed: false };
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ ...baseItem, type: "amulet" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("sums base premiums for multiple main items", () => {
    // sword (100) + amulet (60) = 160; * 1.10 first-insurance = 176; + 5 fee = 181.
    const result = processScenario({
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
  it("charges 25 G per single component", () => {
    // A single rune (component): 25 base * 1.10 first-insurance = 27.5; + 5 fee = 32.5; ceil → 33.
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune", material: "stone", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("applies the special 60 G premium for a block of 3 alike components", () => {
    // 3 runes → block base 60 (not 3*25=75); * 1.10 first-insurance = 66; + 5 fee = 71.
    const rune = { type: "rune", material: "stone", enchantment: 0, cursed: false };
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [rune, rune, rune] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it.todo("adds a 50% surcharge for cursed items");
  it.todo("adds a 30% surcharge for items with enchantment level >= 5");
  it.todo("applies a 20% loyalty discount for customers with >= 2 years");
  it.todo("applies a 15% discount on contracts after the first");
  it.todo("rounds the premium up in MHPCO's favor");
  it.todo("pays out claim damages minus 100 G deductible");
  it.todo("caps total payouts at twice the insurance sum across claims");
  it.todo("reimburses only 50% of damage on items with enchantment >= 8");
  it.todo("fully reimburses damage on dragon material items");
});
