import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Empty / processing fee
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Single item base premiums
  it("single sword (plain, newcomer first contract) yields base + first insurance + fee", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 100 base + 10 first insurance = 110 + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet (plain, newcomer first contract)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 60 base + 6 first insurance = 66 + 5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff (plain, newcomer first contract)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 80 base + 8 first ins + 5 fee = 93
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion (plain, newcomer first contract)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 40 base + 4 first ins + 5 fee = 49
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components and blocks
  it("two runes (no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    // 2*25 = 50 base + 5 first ins = 55 + 5 fee = 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("three alike runes form a block (60 G base)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    // block: 60 base + 6 first ins + 5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("four runes (no block, 100 G base)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
      ],
    });
    // 4*25 = 100 base + 10 first ins + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("three runes + three moonstones form two separate blocks", () => {
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
    // 2 blocks: 60 + 60 = 120 base + 12 first ins + 5 fee = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Cursed and high-enchantment surcharges (item-scope)
  it("cursed sword adds 50% surcharge on the item base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 base + 50 cursed = 150 + 15 first ins = 165 + 5 fee... wait
    // item-level: 100 + 50 = 150 (item base after item modifiers)
    // policy modifiers on policy base 150: +10% first ins = 15 → 165
    // + 5 fee = 170? But spec says 165.
    // Re-reading: spec example 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165
    // So first insurance is applied on the ORIGINAL policy base (100), not the surcharged one.
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("highly enchanted sword (enchantment 5) adds 30% surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    // 100 base + 30 high ench + 10 first ins = 140 + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("cursed and highly enchanted sword stacks both surcharges", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }],
        },
      ],
    });
    // 100 base + 50 cursed + 30 high ench + 10 first ins = 190 + 5 fee = 195
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("policy with cursed sword and plain amulet — surcharge only on cursed item", () => {
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
    // 160 base + 50 cursed (only on sword) + 16 first ins = 226 + 5 fee = 231
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Customer-level modifiers
  it("loyalty discount 20% for customer with 2+ years", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // 100 base + 10 first ins - 20 loyalty = 90 + 5 fee = 95
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("first insurance surcharge 10% on policy base (multi-item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    // 200 base + 20 first ins (10% of policy base 200) = 220 + 5 fee = 225
    expect(result).toEqual({ results: [{ premium: 225 }] });
  });
  it("follow-up contract 15% discount applied on second quote", () => {
    const result = runScenario({
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
    // Step 0: 100 + 10 first ins = 110 + 5 = 115
    // Step 1: 100 + 10 first ins - 15 follow-up = 95 + 5 = 100
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // Rounding
  it("premium rounded UP in favor of MHPCO", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }],
        },
      ],
    });
    // 25 base + 2.5 first ins = 27.5 + 5 fee = 32.5 → rounded UP = 33
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // Integration examples from spec
  it("long-standing customer second contract with cursed enchanted sword → 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // Step 1: 100 base + 50 cursed + 30 high ench - 20 loyalty + 10 first ins - 15 follow-up = 155 + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // Claim — basic
  it("simple claim: damage minus 100 G deductible", () => {
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
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 500 }],
          },
        },
      ],
    });
    // sword premium 115. Claim: 500 - 100 deductible = 400. Cap = 2000 - 400 = 1600.
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("claim on rune (no special clause) yields damage minus deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    // Premium: 3 runes block = 60 + 6 + 5 = 71
    // Insurance sum 750, cap 1500. Payout 200-100=100, remaining 1400
    expect(result).toEqual({
      results: [
        { premium: 71 },
        { payout: 100, remainingCap: 1400 },
      ],
    });
  });
  it("high-enchantment item (enchantment ≥8) reimbursed at 50%, then deductible", () => {
    const result: any = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // High-ench: 1000 * 50% = 500, - 100 deductible = 400 payout. Cap 2000 - 400 = 1600.
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material item fully reimbursed, then deductible", () => {
    const result: any = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    // Dragon material: full reimbursement, then -100 deductible. 800-100=700.
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material + high enchantment → 50% rule wins, then deductible", () => {
    const result: any = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // 50% rule wins: 1000 * 0.5 = 500, - 100 deductible = 400.
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Claim — multiple damages and cap
  it("multiple damaged items — deductible applied per damage event", () => {
    const result: any = runScenario({
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
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    // 500-100 + 300-100 = 600 payout. Cap 3200 - 600 = 2600.
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("cap = 2 × insurance sum; multi-claim cap exhaustion across two claims", () => {
    const result: any = runScenario({
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
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    // Claim 1: 1500-100 = 1400, remaining 2000-1400 = 600
    // Claim 2: desired 1400 but capped to 600. Remaining 0.
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("payout rounded DOWN", () => {
    const result: any = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 701 }] },
        },
      ],
    });
    // 50% of 701 = 350.5, -100 = 250.5 → rounded DOWN = 250
    expect(result.results[1].payout).toBe(250);
  });

  // Error cases
  it("unknown item type in quote → throws / exits non-zero", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item type not in policy → throws", () => {
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
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage amount → throws", () => {
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
    ).toThrow();
  });
  it("claim with more damage entries of a type than insured → throws", () => {
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
              cause: "dragon",
              damages: [
                { itemType: "sword", amount: 500 },
                { itemType: "sword", amount: 300 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
});
