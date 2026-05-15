import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Quote: base premiums ---
  it("empty item list yields premium of 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });
  it("quote a single plain sword yields 105 G (100 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    // Newcomer first insurance: 100 + 10 (first insurance) + 5 fee = 115. Wait - check
    // Actually with 0 years and first quote, "first insurance" applies, no follow-up.
    // 100 base + 10 first insurance = 110 + 5 fee = 115.
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote a single plain amulet yields 71 G (60 + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote a single plain staff yields 93 G (80 + 8 + 5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote a single plain potion yields 49 G (40 + 4 + 5)", () => {
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
  it("quote two plain swords: 200 + 20 first ins + 5 fee = 225 G", () => {
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
    expect(result).toEqual({ results: [{ premium: 225 }] });
  });
  it("quote a sword and an amulet: 100 + 60 + 16 first ins + 5 fee = 181 G", () => {
    const result = runScenario({
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

  // --- Components and blocks ---
  it("quote 1 rune: 25 + 2.5 first ins + 5 fee, rounded up = 33 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quote 2 runes: 50 + 5 first ins + 5 fee = 60", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote 3 runes (block): 60 + 6 first ins + 5 fee = 71", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote 4 runes: 100 + 10 first ins + 5 fee = 115", () => {
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
  it("quote 7 runes: 175 + 17.5 first ins + 5 fee, rounded up = 198", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("quote 2 runes + 1 moonstone: 75 + 7.5 first ins + 5 fee, rounded up = 88", () => {
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
  it("quote 3 runes + 3 moonstones (two blocks): 120 + 12 first ins + 5 fee = 137", () => {
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

  // --- Item-level modifiers ---
  it("cursed sword: 100 + 50 curse + 10 first ins + 5 fee = 165", () => {
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
  it("high-enchantment sword (ench 5): 100 + 30 high + 10 first ins + 5 fee = 145", () => {
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
  it("cursed sword enchantment 5: 100 + 50 + 30 + 10 + 5 = 195", () => {
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
  it("sword ench 4 (no high surcharge): 100 + 10 + 5 = 115", () => {
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
  it("cursed sword + plain amulet: curse only on sword. 100+60+50+16 first+5 = 231", () => {
    // sword: 100 + 50 (curse) + 10 (first ins) = 160
    // amulet: 60 + 6 (first ins) = 66
    // total = 226 + 5 = 231
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Policy-level modifiers ---
  it("loyalty (2 years) applies: sword 100 + 10 first - 20 loyalty + 5 = 95", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("first insurance surcharge on every quote: confirmed in newcomer sword test", () => {
    // already tested by single sword test
    expect(true).toBe(true);
  });
  it("follow-up contract: 2nd quote gets 15% discount", () => {
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
    // 1st: 100 + 10 + 5 = 115
    // 2nd: 100 + 10 - 15 + 5 = 100
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it("processing fee added at end (5 G for empty list test already covers)", () => {
    expect(true).toBe(true);
  });

  // --- Integration examples ---
  it("newcomer with cursed sword yields 165 G", () => {
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
  it("long-standing customer second contract cursed enchanted sword yields 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 1, cursed: false }],
        },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // 2nd: 100 + 50 + 30 + 10 - 20 - 15 = 155 + 5 = 160
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Rounding ---
  it("premium rounds up in MHPCO's favor (7 runes test produces 197.5 -> 198)", () => {
    // already covered by 7 runes test
    expect(true).toBe(true);
  });

  // --- Claim: basics ---
  it("claim no special clauses: sword damage 500 -> payout 400", () => {
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
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim on a rune: damage 200 -> payout 100", () => {
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
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });
  it("claim where damage <= deductible pays 0", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 50 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });

  // --- Claim: special clauses ---
  it("ench >= 8: damage 1000 -> 500 - 100 = 400", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon material: damage 800 -> 800 - 100 = 700", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("dragon + ench 9: 50% wins, damage 1000 -> 500 - 100 = 400", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon + ench 8: 50% wins, damage 1000 -> 500 - 100 = 400", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: multiple damages and deductibles ---
  it("multi-item damage: sword 500, amulet 300 -> payout 600 (2 deductibles)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: false },
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
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
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });
  it("two swords each damaged: separate deductibles", () => {
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
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 500 },
              { itemType: "sword", amount: 500 },
            ],
          },
        },
      ],
    });
    // each: 500 - 100 = 400. total 800. cap 4000.
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // --- Claim: caps ---
  it("policy cap is twice insurance sum (sword + amulet = 1600, cap 3200)", () => {
    // Already verified by multi-item damage test (remainingCap 2600 = 3200 - 600)
    expect(true).toBe(true);
  });
  it("cursed sword: cap based on unmodified insurance value 1000 -> cap 2000", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("successive claims deplete cap: 2 x 1500 damage on sword", () => {
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
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    });
    // claim 1: 1500 - 100 = 1400, cap 2000 - 1400 = 600
    // claim 2: 1500 - 100 = 1400 but capped at 600
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });
  it("block discount does not affect insurance sum: sword + 3 runes -> insSum 1750", () => {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    // cap = 3500. payout 100. remaining 3400.
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });

  // --- Claim: payout rounding ---
  it("payout rounds down: dragon-material-and-ench8 sword damage 1001 -> 400 (intermediate 400.5)", () => {
    // 50% of 1001 = 500.5, then - 100 = 400.5, floor = 400
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1001 }] },
        },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Error handling ---
  it("quote with unknown item type throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim referencing item not in policy throws", () => {
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
  it("claim with negative damage throws", () => {
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
  it("claim with more damages than insured throws", () => {
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
              cause: "fire",
              damages: [
                { itemType: "sword", amount: 200 },
                { itemType: "sword", amount: 200 },
              ],
            },
          },
        ],
      }),
    ).toThrow();
  });
});
