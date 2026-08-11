import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: price list, single main items (new customer, first contract) ---
  it("quotes a sword for a new customer — base 100 G, +10 % first insurance, +5 G fee = 115 G", () => {
    const result = runScenario({
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
  it("quotes an amulet for a new customer — base 60 G, +10 % first insurance, +5 G fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes a staff for a new customer — base 80 G, +10 % first insurance, +5 G fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 1, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a potion for a new customer — base 40 G, +10 % first insurance, +5 G fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Quote: components and building blocks ---
  it("quotes a single rune component — base 25 G, +10 % first insurance, +5 G fee = 33 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune", material: "stone", enchantment: 1, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes a single moonstone component — base 25 G, +10 % first insurance, +5 G fee = 33 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "moonstone", material: "stone", enchantment: 1, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quotes 3 alike runes as a building block — special base 60 G instead of 75 G, +10 %, +5 G fee = 71 G", () => {
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

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quotes 4 alike runes — building block 60 G + single 25 G = 85 G base, +10 %, +5 G fee = 99 G", () => {
    const rune = { type: "rune", material: "stone", enchantment: 1, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [rune, rune, rune, rune] }],
    });

    expect(result).toEqual({ results: [{ premium: 99 }] });
  });
  it("quotes 3 runes and 3 moonstones as two separate building blocks — base 120 G, +10 %, +5 G fee = 137 G", () => {
    const rune = { type: "rune", material: "stone", enchantment: 1, cursed: false };
    const moonstone = { type: "moonstone", material: "stone", enchantment: 1, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [rune, rune, rune, moonstone, moonstone, moonstone] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 137 }] });
  });
  it("does not form a building block from 3 unalike components — 2 runes + 1 moonstone = base 75 G, +10 %, +5 G fee = 88 G", () => {
    const rune = { type: "rune", material: "stone", enchantment: 1, cursed: false };
    const moonstone = { type: "moonstone", material: "stone", enchantment: 1, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [rune, rune, moonstone] }],
    });

    expect(result).toEqual({ results: [{ premium: 88 }] });
  });

  // --- Quote: risk surcharges ---
  it("adds a 50 % risk surcharge for a cursed sword — 150 G, +10 %, +5 G fee = 170 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 170 }] });
  });
  it("adds a 30 % risk surcharge for a highly enchanted sword (enchantment 5) — 130 G, +10 %, +5 G fee = 148 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 148 }] });
  });
  it("does not add the enchantment surcharge below level 5 (enchantment 4) — 100 G, +10 %, +5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("combines cursed and high enchantment surcharges on one sword — 100 G × 1.8 = 180 G, +10 %, +5 G fee = 203 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 203 }] });
  });

  // --- Quote: customer modifiers ---
  it("grants a 20 % loyalty discount for a customer with 2 years — sword 100 G × 0.8 = 80 G, +10 %, +5 G fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("does not grant the loyalty discount below 2 years (1 year) — sword 100 G, +10 %, +5 G fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies a 15 % discount on the second contract instead of the first-insurance surcharge — sword 100 G × 0.85 = 85 G, +5 G fee = 90 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });
  it("applies the 15 % discount to the third contract as well — sword 100 G × 0.85 = 85 G, +5 G fee = 90 G", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 90 }, { premium: 90 }],
    });
  });

  // --- Quote: rounding and combinations ---
  it("rounds the premium up in MHPCO's favor — loyal customer's second contract on a staff: 80 × 0.8 × 0.85 = 54.4 → 55, +5 G fee = 60 G", () => {
    const staff = { type: "staff", material: "oak", enchantment: 1, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [staff] },
        { op: "quote", items: [staff] },
      ],
    });

    // 80 × 0.8 × 1.1 = 70.4 → 71, +5 = 76 for the first contract.
    expect(result).toEqual({ results: [{ premium: 76 }, { premium: 60 }] });
  });
  it("quotes a mixed list of items in one contract — sword + amulet + 3 runes = 100 + 60 + 60 = 220 G, +10 %, +5 G fee = 247 G", () => {
    const rune = { type: "rune", material: "stone", enchantment: 1, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
            rune,
            rune,
            rune,
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 247 }] });
  });

  // --- Claims: deductible ---
  it("deducts the 100 G deductible from a single damage — 200 G damage on an amulet pays out 100 G", () => {
    const result = runScenario({
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
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 58 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("pays out 0 G when the damage does not exceed the deductible — 60 G damage pays out 0 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "clumsiness", damages: [{ itemType: "amulet", amount: 60 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 58 }, { payout: 0, remainingCap: 1200 }],
    });
  });
  it("applies the deductible once per damage event, not per damaged item — two 200 G damages in one incident pay out 300 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "storm",
            damages: [
              { itemType: "sword", amount: 200 },
              { itemType: "amulet", amount: 200 },
            ],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 146 }, { payout: 300, remainingCap: 2900 }],
    });
  });

  // --- Claims: reimbursement rules ---
  it("reimburses damage to an item with enchantment ≥ 8 at 50 % — 400 G damage → 200 G, minus 100 G deductible = 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon fire", damages: [{ itemType: "sword", amount: 400 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 120 }, { payout: 100, remainingCap: 1900 }],
    });
  });
  it("fully reimburses damage to a dragon-material item, overriding the high-enchantment halving — 400 G damage minus 100 G deductible = 300 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "rockfall", damages: [{ itemType: "sword", amount: 400 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 120 }, { payout: 300, remainingCap: 1700 }],
    });
  });
  it("fully reimburses damage to a dragon-material item with low enchantment — 400 G damage minus 100 G deductible = 300 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 3, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "flood", damages: [{ itemType: "sword", amount: 400 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 93 }, { payout: 300, remainingCap: 1700 }],
    });
  });

  // --- Claims: cap ---
  it("reports the remaining cap for a component policy — 3 runes insured at 250 G each, cap 1500 G, payout 200 G leaves 1300 G", () => {
    const rune = { type: "rune", material: "stone", enchantment: 1, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [rune, rune, rune] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spell mishap", damages: [{ itemType: "rune", amount: 300 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 71 }, { payout: 200, remainingCap: 1300 }],
    });
  });
  it("caps the payout at twice the insurance sum — amulet policy cap 1200 G, 5000 G damage pays out 1200 G and leaves 0 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "amulet", amount: 5000 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 58 }, { payout: 1200, remainingCap: 0 }],
    });
  });
  it("carries the remaining cap across successive claims on the same policy — second claim is limited by what the first left", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "amulet", amount: 5000 }] },
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "aftershock", damages: [{ itemType: "amulet", amount: 500 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [
        { premium: 58 },
        { payout: 1200, remainingCap: 0 },
        { payout: 0, remainingCap: 0 },
      ],
    });
  });
  it("caps against the summed insurance sum of all insured items — sword + amulet policy cap = 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "cataclysm", damages: [{ itemType: "sword", amount: 10000 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 146 }, { payout: 3200, remainingCap: 0 }],
    });
  });

  // --- Scenario integration ---
  // The scenario from the kata's schema example 2.
  it("processes a quote followed by two claims on the same policy, returning one result per step in order", () => {
    const result = runScenario({
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

    expect(result).toEqual({
      results: [
        { premium: 58 },
        { payout: 100, remainingCap: 1100 },
        { payout: 150, remainingCap: 950 },
      ],
    });
  });
  it("keeps separate caps for two policies of the same customer", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "shattering", damages: [{ itemType: "potion", amount: 5000 }] },
        },
        {
          op: "claim",
          policy: 1,
          incident: { cause: "theft", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [
        { premium: 41 },
        { premium: 46 },
        { payout: 800, remainingCap: 0 },
        { payout: 200, remainingCap: 1000 },
      ],
    });
  });
});
