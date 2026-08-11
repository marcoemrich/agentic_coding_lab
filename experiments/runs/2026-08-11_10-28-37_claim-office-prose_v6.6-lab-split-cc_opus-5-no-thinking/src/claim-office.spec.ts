import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: price list, single main items (first contract, new customer) ---
  it("quotes a sword for a new customer's first contract — 100 base +10% first insurance +5 fee = 115 G", () => {
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
  it("quotes an amulet for a new customer's first contract — 60 base +10% +5 = 71 G", () => {
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
  it("quotes a staff for a new customer's first contract — 80 base +10% +5 = 93 G", () => {
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
  it("quotes a potion for a new customer's first contract — 40 base +10% +5 = 49 G", () => {
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

  // --- Quote: components ---
  it("quotes a single rune — 25 base +10% +5 = 33 G", () => {
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
  it("quotes two alike components separately — 50 base +10% +5 = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quotes a building block of 3 alike components at the special 60 G base premium — 60 +10% +5 = 71 G", () => {
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
  it("quotes 3 unlike components without the building block premium — 75 base +10% +5 = 88 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "rune", material: "stone", enchantment: 1, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("quotes 4 alike components as one building block plus one single — 60+25=85 base +10% +5 = 99 G", () => {
    const rune = { type: "rune", material: "stone", enchantment: 1, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [rune, rune, rune, rune] }],
    });

    expect(result).toEqual({ results: [{ premium: 99 }] });
  });

  // --- Quote: several items ---
  it("sums the base premiums of several main items — sword + potion = 140 base +10% +5 = 159 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 159 }] });
  });

  // --- Quote: per-item risk surcharges ---
  it("adds a 50% risk surcharge for a cursed item — cursed sword 150 base +10% +5 = 170 G", () => {
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
  it("adds a 30% risk surcharge for a highly enchanted item (enchantment 5) — 130 base +10% +5 = 148 G", () => {
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
  it("does not add the enchantment surcharge below level 5 — enchantment 4 sword = 115 G", () => {
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
  it("applies both surcharges to a cursed, highly enchanted item — 100*1.5*1.3 = 195 base +10% +5 = 220 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 220 }] });
  });

  // --- Quote: customer-level modifiers ---
  it("gives a 20% loyalty discount to a customer with 2 years — sword 100*1.1*0.8 = 88 +5 = 93 G", () => {
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
  it("gives no loyalty discount below 2 years — 1 year sword = 115 G", () => {
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
  it("applies a 15% discount to the second contract instead of the first-insurance surcharge — sword 100*0.85 = 85 +5 = 90 G", () => {
    const swordQuote = {
      op: "quote" as const,
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [swordQuote, swordQuote],
    });

    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });
  it("applies the 15% subsequent-contract discount to the third contract as well — sword = 90 G", () => {
    const swordQuote = {
      op: "quote" as const,
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [swordQuote, swordQuote, swordQuote],
    });

    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 90 }, { premium: 90 }],
    });
  });
  it("combines loyalty and subsequent-contract discounts — 5-year customer's second sword 100*0.85*0.8 = 68 +5 = 73 G", () => {
    const swordQuote = {
      op: "quote" as const,
      items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
    };
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [swordQuote, swordQuote],
    });

    expect(result).toEqual({ results: [{ premium: 93 }, { premium: 73 }] });
  });

  // --- Quote: rounding ---
  it("rounds the premium up in MHPCO's favor — 5-year customer's first amulet 60*1.1*0.8 = 52.8 -> 53 +5 = 58 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 58 }] });
  });

  // --- Claim: deductible and reimbursement rules ---
  it("pays the damage minus the 100 G deductible — 200 G damage on an amulet policy pays 100 G", () => {
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
  it("pays nothing when the damage does not exceed the deductible — 80 G damage pays 0 G", () => {
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
          incident: { cause: "clumsiness", damages: [{ itemType: "amulet", amount: 80 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 58 }, { payout: 0, remainingCap: 1200 }],
    });
  });
  it("applies one deductible per damage event, not per damaged item — two 100 G damages pay 100 G", () => {
    const amulet = { type: "amulet", material: "silver", enchantment: 2, cursed: false };
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [amulet, amulet] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "flood",
            damages: [
              { itemType: "amulet", amount: 100 },
              { itemType: "amulet", amount: 100 },
            ],
          },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 111 }, { payout: 100, remainingCap: 2300 }],
    });
  });
  it("reimburses damage to an item with enchantment >= 8 at 50% — 400 G damage pays 200-100 = 100 G", () => {
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
          incident: { cause: "troll", damages: [{ itemType: "sword", amount: 400 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 120 }, { payout: 100, remainingCap: 1900 }],
    });
  });
  it("fully reimburses damage to an item made of dragon material — 400 G damage pays 300 G", () => {
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
          incident: { cause: "troll", damages: [{ itemType: "sword", amount: 400 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 120 }, { payout: 300, remainingCap: 1700 }],
    });
  });
  it("reports the remaining cap of twice the insurance sum after a claim — amulet policy 1200 cap, 100 G payout leaves 1100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
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
      results: [{ premium: 71 }, { payout: 100, remainingCap: 1100 }],
    });
  });
  it("reduces the remaining cap across successive claims on the same policy — second claim of 250 G pays 150 G leaving 950 G", () => {
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
  it("caps the payout at the remaining cap of twice the insurance sum — payout never exceeds the cap and remaining cap reaches 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon fire", damages: [{ itemType: "potion", amount: 5000 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 41 }, { payout: 800, remainingCap: 0 }],
    });
  });

  // --- Scenario / CLI-level integration ---
  it("processes a quote-only scenario — schema example 1 yields {premium: 115}", () => {
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
  it("processes a quote followed by two claims — schema example 2 yields 58, then 100/1100, then 150/950", () => {
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
});
