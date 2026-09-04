import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums for single main items ---
  it("quotes an empty item list at 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quotes a plain sword at 115 G (100 base + 10 first insurance + 5 fee)", () => {
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
  it("quotes a plain amulet at 71 G (60 base + 6 first insurance + 5 fee)", () => {
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
  it("quotes a plain staff at 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "oak", enchantment: 2, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quotes a plain potion at 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Quote: components and the building block of 3 alike components ---
  it("prices 2 runes at 50 G base premium (no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    // 50 base + 5 first insurance + 5 fee
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("prices 3 runes at 60 G base premium (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });

    // 60 base (block) + 6 first insurance + 5 fee
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("prices 4 runes at 100 G base premium (no block — block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    // 100 base (no block) + 10 first insurance + 5 fee
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("prices 7 runes at 175 G base premium (no block — block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });

    // 175 base + 17.5 first insurance = 192.5, + 5 fee = 197.5, rounded up
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- Quote: "alike" means exactly the same component type (❓) ---
  it("prices 2 runes + 1 moonstone at 75 G base premium (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] },
      ],
    });

    // 75 base (no block — mixed types) + 7.5 first insurance = 82.5, + 5 fee = 87.5, rounded up
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("prices 3 runes + 3 moonstones at 120 G base premium (two separate blocks)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });

    // 60 + 60 base (two blocks) + 12 first insurance = 132, + 5 fee
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Quote: item-specific modifiers ---
  it("adds a 50 % curse surcharge to the cursed item's base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 10 first insurance (10 % of the 100 base) + 5 fee
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("adds a 30 % high-enchantment surcharge for enchantment exactly 5", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    // 100 base + 30 high enchantment + 10 first insurance + 5 fee
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("adds no high-enchantment surcharge for enchantment 4", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee — no surcharge below enchantment 5
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies both curse and high-enchantment surcharges to a cursed sword with enchantment 5", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    // 100 base + 50 curse + 30 high enchantment + 10 first insurance + 5 fee
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Quote: modifier scope on multi-item policies (❓) ---
  it("applies the curse surcharge only to the cursed item: cursed sword + plain amulet → 210 G before policy modifiers and fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    });

    // 160 policy base + 50 curse (50 % of the sword's 100, not of the policy total)
    // = 210, + 16 first insurance (10 % of the 160 base) + 5 fee
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Quote: policy-wide modifiers ---
  it("applies a 20 % loyalty discount for a customer with exactly 2 years with MHPCO", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    // 100 base − 20 loyalty + 10 first insurance + 5 fee
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("applies no loyalty discount for a customer with 1 year with MHPCO", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    // 100 base + 10 first insurance + 5 fee — no discount below 2 years
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies a 10 % first insurance surcharge on the policy base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "potion", material: "glass", enchantment: 1, cursed: false },
          ],
        },
      ],
    });

    // The surcharge is 10 % of the policy base *after* the rune block is priced:
    // 60 + 40 = 100, so 10 — not 10 % of the un-blocked 115.
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("applies a 15 % follow-up discount on the customer's second quote", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    // First: 100 + 10 first insurance + 5 fee. Second: additionally − 15 follow-up
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // --- Quote: rounding in the MHPCO's favor ---
  it("rounds a premium of 197.5 G up to 198 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
          ],
        },
      ],
    });

    // 60 (rune block) + 25 = 85 base, + 8.5 first insurance + 5 fee = 98.5, rounded up
    expect(result).toEqual({ results: [{ premium: 99 }] });
  });
  it("keeps intermediate amounts as fractions and rounds only the final premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone", cursed: true }] }],
    });

    // 25 base + 12.5 curse + 2.5 first insurance + 5 fee = 45 exactly.
    // Rounding each intermediate up instead would give 25 + 13 + 3 + 5 = 46.
    expect(result).toEqual({ results: [{ premium: 45 }] });
  });

  // --- Quote: integration examples ---
  it("quotes a newcomer's cursed sword at 165 G (100 base + 50 curse + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("quotes a long-standing customer's second contract with a cursed enchantment-7 sword at 160 G (100 + 50 + 30 − 20 + 10 − 15 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    // First: 40 base + 4 first insurance − 8 loyalty + 5 fee = 41
    // Second: 100 + 50 curse + 30 high enchantment − 20 loyalty
    //         + 10 first insurance − 15 follow-up = 155, + 5 fee = 160
    expect(result).toEqual({ results: [{ premium: 41 }, { premium: 160 }] });
  });

  // --- Quote: errors ---
  it("rejects a quote containing an item with an unknown type (e.g. broomstick)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow(/broomstick/);
  });

  // --- Claim: standard reimbursement ---
  it("pays 400 G for a steel enchantment-3 sword with 500 G damage (full reimbursement − 100 G deductible)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    // Insurance sum 1000 → cap 2000. Payout 500 − 100 deductible = 400, leaving 1600.
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("pays 100 G for a damaged rune with 200 G damage (no enchantment or material clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "mishap", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });

    // Premium 25 + 2.5 + 5 = 32.5 → 33. Insurance sum 250 → cap 500; payout 200 − 100.
    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Claim: special clauses ---
  it("pays 400 G for a steel enchantment-9 sword with 1000 G damage (50 % clause, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // Premium 100 + 30 high enchantment + 10 first insurance + 5 fee = 145.
    // Payout: 50 % of 1000 = 500, − 100 deductible = 400; cap 2000 → 1600 left.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("pays 700 G for a dragon-material enchantment-5 sword with 800 G damage (full reimbursement, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "rockfall", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });

    // Enchantment 5 is below the claim threshold of 8, so only the dragon-material
    // clause applies: full 800 − 100 deductible = 700; cap 2000 → 1300 left.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("pays 400 G for a dragon-material enchantment-9 sword with 1000 G damage (50 % rule wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // Both clauses apply; the 50 % rule wins: 500 − 100 deductible = 400.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("pays 400 G for a dragon-material sword with exactly enchantment 8 and 1000 G damage", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });

    // Exactly 8 triggers the half clause: 500 − 100 deductible = 400.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Claim: deductible per damage event ---
  it("pays 600 G when a dragon attack damages a sword (500 G) and an amulet (300 G) — one deductible per damaged item", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
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
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });

    // Premium: 160 base + 16 first insurance + 5 fee = 181.
    // Payout: (500 − 100) + (300 − 100) = 600; insurance sum 1600 → cap 3200 → 2600 left.
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claim: rounding in the MHPCO's favor ---
  it("rounds a payout of 350.5 G down to 350 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "rockfall", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });

    // Half of 901 = 450.5, − 100 deductible = 350.5 → floors to 350.
    // Cap 2000 − 350.5 = 1649.5 remaining, reported floored as 1649.
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1649 }],
    });
  });

  // --- Claim: insurance sum and cap ---
  it("reports remainingCap based on twice the insurance sum for a single sword policy (cap 2000 G)", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });

    // Damage exactly at the deductible pays nothing, leaving the full
    // cap of 2000 (= 2 × the sword's 1000 insurance value) on view.
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("computes the insurance sum of a sword + amulet policy as 1600 G (cap 3200 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });

    // Damage at the deductible pays nothing, so the full cap of 3200
    // (= 2 × [1000 + 600]) is on view rather than inferred from a drawdown.
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }],
    });
  });
  it("bases the cap on the unmodified insurance value: a cursed sword still has cap 2000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });

    // The curse raises the premium to 165 but leaves the insurance value at
    // 1000, so the cap stays 2000 — premium modifiers do not raise the cap.
    expect(result).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("computes the insurance sum of a sword + 3 runes (a block) as 1750 G — the block discount affects only the premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });

    // Premium takes the block: 100 + 60 (not 75) = 160, + 16 + 5 = 181.
    // The insurance sum does not: 1000 + 3×250 = 1750, so the cap is 3500.
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }],
    });
  });

  // --- Claim: cap exhaustion across successive claims ---
  it("pays 1400 G on a first 1500 G claim against a sword policy, leaving 600 G of cap", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });

    // 1500 − 100 deductible = 1400, within the 2000 cap; 600 of cap left.
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("reduces a second 1500 G claim to the remaining cap: payout 600 G, remainingCap 0 G", () => {
    const claim = {
      op: "claim" as const,
      policy: 0,
      incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
    };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        claim,
        claim,
      ],
    });

    // Cap 2000. First claim takes 1400, leaving 600. The second wants 1400 too,
    // but is reduced to the 600 that remains.
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Claim: multiple items of the same type (❓) ---
  it("insures two swords at an insurance sum of 2000 G (cap 4000 G)", () => {
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false };

    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword, sword] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    // Premium 200 base + 20 first insurance + 5 fee = 225.
    // Insurance sum 2000 → cap 4000; payout 400 leaves 3600.
    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 400, remainingCap: 3600 }],
    });
  });
  it("treats two sword damage entries as separate damages, each with its own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 9, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 1000 },
              { itemType: "sword", amount: 1000 },
            ],
          },
        },
      ],
    });

    // Premium: 200 base + 30 (sword A's own high-enchantment surcharge)
    //          + 20 first insurance + 5 fee = 255.
    // Each damage pairs with a distinct sword: the enchantment-9 one is halved
    // (500 − 100 = 400), the enchantment-3 one is not (1000 − 100 = 900) → 1300.
    expect(result).toEqual({
      results: [{ premium: 255 }, { payout: 1300, remainingCap: 2700 }],
    });
  });
  it("rejects a claim with more damage entries of a type than the policy covers", () => {
    expect(() =>
      runScenario({
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
              cause: "dragon attack",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow(/sword/);
  });

  // --- Claim: errors ---
  it("rejects a claim whose damage references an item not part of the policy (amulet damaged, only a sword insured)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
          },
        ],
      }),
    ).toThrow(/amulet/);
  });
  it("rejects a claim whose damage references an unknown item type", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] },
          },
        ],
      }),
    ).toThrow(/broomstick/);
  });
  it("pays nothing for damage below the deductible, and does not return cap to the policy", () => {
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
          incident: { cause: "scratch", damages: [{ itemType: "sword", amount: 50 }] },
        },
      ],
    });

    // A 50 G scratch is worth less than the deductible: the MHPCO pays nothing.
    // It must not bill the customer, nor hand cap back — the spec caps the total
    // payout at twice the insurance sum, and a returned cap would breach that.
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 0, remainingCap: 2000 }],
    });
  });

  it("rejects a claim containing a damage entry with a negative amount", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
          },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow(/-200/);
  });

  // --- Multi-step scenarios ---
  it("processes a scenario of a quote followed by a claim against that policy, returning results in step order", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    // The claim names policy 0, so it must find the sword policy the *first*
    // quote created — not the potion policy filed one step later.
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { premium: 43 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
});
