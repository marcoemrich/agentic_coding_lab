import { describe, it, expect } from "vitest";
import { spawnSync } from "node:child_process";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: empty and single items (base premiums + fee) ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });

    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("single sword (plain, new customer) → 100 G base + 10 G first insurance + 5 G fee = 115 G", () => {
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
  it("single amulet (plain, new customer) → 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
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
  it("single staff (plain, new customer) → 80 G base + 8 G first insurance + 5 G fee = 93 G", () => {
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
  it("single potion (plain, new customer) → 40 G base + 4 G first insurance + 5 G fee = 49 G", () => {
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
  it("single rune (component) → 25 G base + 2.5 G first insurance + 5 G fee = 33 G (rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // --- Building block of 3 alike components ---
  it("2 runes → 50 G base premium", () => {
    // base 50 + 5 first insurance + 5 fee = 60 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });

    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    // base 60 + 6 first insurance + 5 fee = 71 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    // base 100 + 10 first insurance + 5 fee = 115 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium", () => {
    // base 175 + 17.5 first insurance + 5 fee = 197.5 → 198 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- "Alike" components means same type ---
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    // base 75 + 7.5 first insurance + 5 fee = 87.5 → 88 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    // base 60 + 60 = 120, + 12 first insurance + 5 fee = 137 G
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

    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  it("3 swords → 300 G base premium (no block — the block is a components-only rule)", () => {
    // base 300 + 30 first insurance + 5 fee = 335 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "sword" }, { type: "sword" }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 335 }] });
  });

  // --- Item-specific modifiers ---
  it("cursed sword adds 50 % of that item's base premium (100 G → +50 G)", () => {
    // spec "Newcomer with a cursed sword": 100 base + 50 curse + 10 first
    // insurance = 160, + 5 fee = 165. The first-insurance 10 % is taken on the
    // base premium, not on the curse-inflated amount.
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
  it("sword with enchantment 5 adds 30 % high-enchantment surcharge (100 G → +30 G)", () => {
    // base 100 + 30 high enchantment + 10 first insurance + 5 fee = 145 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 has no high-enchantment surcharge", () => {
    // base 100 + 0 surcharge + 10 first insurance + 5 fee = 115 G
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
  it("cursed sword with enchantment 5 gets both surcharges (+50 G and +30 G)", () => {
    // base 100 + 50 curse + 30 high enchantment + 10 first insurance + 5 fee = 195 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet → policy base 160 G, curse adds 50 G (not 50 % of policy total) → 210 G before further modifiers and fee", () => {
    // policy base 160 + 50 curse (50 % of the sword's 100, not of 160)
    // + 16 first insurance (10 % of 160) + 5 fee = 231 G
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

    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Policy-wide modifiers ---
  it("customer with exactly 2 years with MHPCO → 20 % loyalty discount on the policy base premium", () => {
    // base 100 − 20 loyalty + 10 first insurance + 5 fee = 95 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer with 1 year with MHPCO → no loyalty discount", () => {
    // one year short of the threshold: 100 base + 10 first insurance + 5 fee
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
  // "first insurance surcharge applies to every quote" needs no test of its own:
  // it is folded into every premium expectation above, and zeroing the rate
  // fails 36 of them.
  it("second quote in a scenario receives a 15 % follow-up contract discount", () => {
    // step 0: 100 + 10 first insurance + 5 fee = 115 G
    // step 1: 100 + 10 first insurance − 15 follow-up + 5 fee = 100 G
    const sword = { type: "sword", material: "steel", enchantment: 3, cursed: false } as const;
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [sword] },
        { op: "quote", items: [sword] },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // --- Rounding in MHPCO's favour ---
  // the round-up is pinned by "7 runes → 175 G base premium", whose 197.5 total
  // is the spec's own rounding example; flipping ceil to floor fails it.
  it("a payout calculation that yields 350.5 G → final payout 350 G (rounded down)", () => {
    // 50 % of 901 = 450.5, − 100 deductible = 350.5 → 350 in MHPCO's favour
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // --- Integration examples ---
  // the spec's "Newcomer with a cursed sword" integration example (165 G) is
  // asserted verbatim by the cursed-sword test above.
  it("3-year customer's second quote, cursed steel sword enchantment 7 → premium 160 G", () => {
    // step 0: 100 − 20 loyalty + 10 first insurance + 5 fee = 95 G
    // step 1: 100 + 50 curse + 30 high enchantment − 20 loyalty + 10 first
    //         insurance − 15 follow-up = 155, + 5 fee = 160 G
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });

    expect(result).toEqual({ results: [{ premium: 95 }, { premium: 160 }] });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    // full reimbursement 500 − 100 deductible = 400; cap 2 × 1000 = 2000,
    // less the 400 paid = 1600 remaining
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
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("damage to a rune (no enchantment, no material), damage 200 G → payout 100 G", () => {
    // 200 − 100 deductible = 100; cap = 2 × 250 = 500, less 100 paid = 400
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 33 }, { payout: 100, remainingCap: 400 }],
    });
  });

  // --- Claim: special clauses ---
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (full reimbursement, then deductible)", () => {
    // dragon material → full 800, then − 100 deductible = 700; cap 2000 − 700 = 1300
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
          incident: { cause: "dragon attack", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % first, then deductible)", () => {
    // 50 % of 1000 = 500, then − 100 deductible = 400; cap 2000 − 400 = 1600
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

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins over dragon material)", () => {
    // both clauses apply; the 50 % rule wins: 500, then − 100 deductible = 400
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

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G", () => {
    // exactly 8 meets the threshold: 50 % of 1000 = 500, then − 100 = 400
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

    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damaging sword (500 G) and amulet (300 G) → payout 600 G (deductible once per damaged item)", () => {
    // (500 − 100) + (300 − 100) = 600; cap 2 × (1000 + 600) = 3200, − 600 = 2600
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

    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // --- Claim: cap ---
  it("a policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G", () => {
    // insurance sum 1000 + 600 = 1600, so the cap is 3200; a 100 G damage is
    // entirely absorbed by the deductible, leaving the cap untouched
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

    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3200 }],
    });
  });
  it("a cursed sword → cap 2000 G based on the unmodified insurance value", () => {
    // the curse raises the premium to 165 G but leaves the cap at 2 × 1000
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

    expect(result).toEqual({
      results: [{ premium: 165 }, { payout: 0, remainingCap: 2000 }],
    });
  });
  it("a policy covering a sword and 3 runes → insurance sum 1750 G (block discount affects premium only)", () => {
    // premium: 100 sword + 60 rune block = 160 base, + 16 first insurance + 5 = 181
    // cap: 1000 + 3 × 250 = 1750 insurance sum → 3500, undiminished by the block
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

    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 0, remainingCap: 3500 }],
    });
  });
  it("sword policy (cap 2000 G), first claim of 1500 G → payout 1400 G, remainingCap 600 G", () => {
    // 1500 − 100 = 1400; cap 2000 − 1400 = 600 remaining
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

    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 1400, remainingCap: 600 }],
    });
  });
  it("sword policy, second claim of 1500 G after the first → payout 600 G, remainingCap 0 G", () => {
    // first claim consumes 1400 of the 2000 cap; the second wants 1400 but only
    // 600 remains, so it is reduced to 600 and the cap is exhausted
    const claim1500 = {
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
        claim1500,
        claim1500,
      ],
    });

    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // --- Multiple items of the same type ---
  it("a policy covering two swords → insurance sum 2000 G, cap 4000 G", () => {
    // two swords are insured separately: base 200, cap 2 × 2000 = 4000
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 100 }] },
        },
      ],
    });

    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 0, remainingCap: 4000 }],
    });
  });
  it("two sword damage entries against a two-sword policy → each is a separate damage with its own deductible", () => {
    // (500 − 100) + (300 − 100) = 600; cap 4000 − 600 = 3400
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
          ],
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
    });

    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 600, remainingCap: 3400 }],
    });
  });
  it("more damage entries of a type than insured (two sword damages, one sword insured) → the claim is rejected", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword" as const, material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
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
    };

    expect(() => runScenario(scenario)).toThrow();
  });

  // --- Error cases ---
  it("quote with an unknown item type (broomstick) → error, no results", () => {
    // the cast simulates untyped JSON input, which is what the CLI receives
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    } as unknown as Parameters<typeof runScenario>[0];

    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim damaging an amulet when only a sword is insured → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword" as const, material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 300 }] },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim with a damage entry of an unknown item type → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword" as const, material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "broomstick", amount: 300 }] },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow();
  });
  it("claim with a damage entry amount of -200 → error", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote" as const,
          items: [{ type: "sword" as const, material: "steel", enchantment: 3, cursed: false }],
        },
        {
          op: "claim" as const,
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
        },
      ],
    };

    expect(() => runScenario(scenario)).toThrow();
  });

  // --- CLI ---
  it("CLI reads a scenario from stdin and writes {results:[...]} to stdout", () => {
    // the spec's own schema example: 5-year customer, amulet quoted then claimed
    // premium: 60 base − 12 loyalty + 6 first insurance + 5 fee = 59
    // payout: 200 − 100 deductible = 100; cap 1200 − 100 = 1100
    const scenario = {
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
    };

    const run = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      timeout: 30000,
    });

    expect(run.status).toBe(0);
    expect(JSON.parse(run.stdout)).toEqual({
      results: [{ premium: 59 }, { payout: 100, remainingCap: 1100 }],
    });
  }, 30000);
  it("CLI exits with a non-zero status code and writes to stderr on an invalid scenario", () => {
    const scenario = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };

    const run = spawnSync("npx", ["tsx", "src/cli.ts"], {
      input: JSON.stringify(scenario),
      encoding: "utf8",
      timeout: 30000,
    });

    expect(run.status).not.toBe(0);
    expect(run.stdout).not.toContain("results");
    // an error DESCRIPTION, not a crash: the message without a stack trace
    expect(run.stderr).toContain("broomstick");
    expect(run.stderr).not.toContain("at basePremiumForItem");
  }, 30000);
});
