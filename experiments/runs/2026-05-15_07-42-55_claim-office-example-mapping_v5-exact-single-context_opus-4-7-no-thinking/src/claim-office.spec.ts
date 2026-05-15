import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: empty and simple base premiums ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });
  it("single sword (steel, enchantment 3, not cursed), newcomer, first contract → 100 base + 10 first + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet (silver, enchantment 2, not cursed), newcomer, first contract → 60 base + 6 first + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("single staff base 800/80 G premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 1, cursed: false }] }],
    });
    expect(result.results[0]).toEqual({ premium: Math.ceil(80 + 8 + 5) });
  });
  it("single potion base 400/40 G premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "liquid", enchantment: 1, cursed: false }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // --- Components & blocks ---
  it("2 runes → 50 G base premium (no block) - quote total: 50 + 5 first + 5 fee = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes → 60 G base (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    // base 60 + first 6 + fee 5 = 71
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes → 100 G base (no block, block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    // base 100 + first 10 + fee 5 = 115
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("7 runes → 175 G base", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    // base 175 + first 17.5 + fee 5 = 197.5 → 198
    expect(result.results[0]).toEqual({ premium: 198 });
  });
  it("2 runes + 1 moonstone → 75 G base (no block: different types)", () => {
    const items = [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }];
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    // base 75 + first 7.5 + fee 5 = 87.5 → 88
    expect(result.results[0]).toEqual({ premium: 88 });
  });
  it("3 runes + 3 moonstones → 120 G base (two separate blocks)", () => {
    const items = [
      { type: "rune" }, { type: "rune" }, { type: "rune" },
      { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
    ];
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    // base 120 + first 12 + fee 5 = 137
    expect(result.results[0]).toEqual({ premium: 137 });
  });

  // --- Premium modifiers (per-item and policy-wide) ---
  it("cursed sword (steel, enchantment 3), newcomer first contract → 165 G (integration example)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    // 100 base + 50 curse + 10 first = 160 + 5 fee = 165
    expect(result.results[0]).toEqual({ premium: 165 });
  });
  it("cursed sword + plain amulet on same policy applies cursed surcharge only to the sword", () => {
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
    // base 160, +50 curse on sword = 210, +16 first (10% of base 160), +5 fee = 231
    expect(result.results[0]).toEqual({ premium: 231 });
  });
  it("loyalty discount applies at exactly 2 years", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    // base 100, -20 loyalty, +10 first = 90, +5 fee = 95
    expect(result.results[0]).toEqual({ premium: 95 });
  });
  it("high-enchantment surcharge applies at exactly enchantment 5", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    // base 100, +30 high-enchantment (30% of 100), +10 first = 140, +5 fee = 145
    expect(result.results[0]).toEqual({ premium: 145 });
  });
  it("no high-enchantment surcharge at enchantment 4", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    // base 100, no surcharge, +10 first, +5 fee = 115
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("long-standing customer's second contract cursed enchantment-7 sword → 160 G (integration example)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    // 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first - 15 follow-up = 155 + 5 fee = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Rounding ---
  it("premium rounding is up (MHPCO's favor): 197.5 → 198", () => {
    // 7 runes: 175 base, 17.5 first, 5 fee = 197.5 → 198
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({ customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] });
    expect(result.results[0]).toEqual({ premium: 198 });
  });

  // --- Quote validation ---
  it("quote with unknown item type → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })
    ).toThrow();
  });

  // --- Claim: standard reimbursement ---
  it("regular sword enchantment 3 damage 500 → payout 400 (full minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 2000 - 400 });
  });
  it("damage to a rune insurance value 250, damage 200 → payout 100 (no special clause)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "spill", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    // cap = 2*250 = 500, payout 100, remaining 400
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: high-enchantment clause ---
  it("steel sword enchantment 9 damage 1000 → payout 400 (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 9 damage 1000 → payout 400 (50% wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword enchantment 5 damage 800 → payout 700 (dragon full, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon-material sword enchantment 8 damage 1000 → payout 400 (high-enchant applies, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: multiple damages ---
  it("dragon attack damages sword 500 and amulet 300 → payout 600 (deductible per damage)", () => {
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
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "amulet", amount: 300 },
            ],
          },
        },
      ],
    });
    // cap = 2*(1000+600) = 3200
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: cap ---
  it("sword cap 2000, two claims of 1500 each → first 1400 (cap remaining 600), second 600 (cap remaining 0)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Claim: payout rounding ---
  it("payout 350.5 → 350 (rounded down, MHPCO's favor)", () => {
    // steel sword ench 8, damage 901 → 450.5 - 100 = 350.5 → floor 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 350, remainingCap: 2000 - 350 });
  });

  // --- Claim: validation ---
  it("claim with negative damage amount → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
        ],
      })
    ).toThrow();
  });
  it("claim references item not on policy → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] } },
        ],
      })
    ).toThrow();
  });
  it("damages contain more entries of a type than the policy covers → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "x",
              damages: [
                { itemType: "sword", amount: 100 },
                { itemType: "sword", amount: 100 },
              ],
            },
          },
        ],
      })
    ).toThrow();
  });

  // --- Multi-step scenario ---
  it("scenario with quote then claim produces results array in step order", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        { op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    });
    expect(result.results).toHaveLength(2);
    expect(result.results[0]).toHaveProperty("premium");
    expect(result.results[1]).toHaveProperty("payout");
    expect(result.results[1]).toHaveProperty("remainingCap");
  });
});
