import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === Simplest cases ===
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // === Single-item base premiums (with fee, no other modifiers, no first-insurance for simplicity: use loyal customer with history? — no, simpler: use follow-up customer setup) ===
  // These first tests use a scenario where the customer has no special status;
  // but every first item in a quote triggers first-insurance surcharge.
  // We'll express them via full scenarios to keep the abstraction consistent.

  it("single sword, newcomer, first item → premium 115 G (100 base + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet, newcomer, first item → premium 71 G (60 base + 6 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff, newcomer, first item → premium 93 G (80 base + 8 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion, newcomer, first item → premium 49 G (40 base + 4 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // === Components ===
  it("2 runes → 50 G base premium (block does not apply) → total 60 G (50 + 5 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies) → total 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — requires exactly 3) → total 115 G", () => {
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
  it("7 runes → 175 G base premium (no block) → total 198 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array(7).fill({ type: "rune" }),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // === "Alike" components — same type only ===
  it("2 runes + 1 moonstone → 75 G base premium → total 88 G (75 + 7.5 first + 5 fee, ceil)", () => {
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
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) → total 137 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" }, { type: "rune" }, { type: "rune" },
            { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // === Item-specific modifiers ===
  it("cursed sword, newcomer → premium 165 G (100 base + 50 curse + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment exactly 5 → premium 145 G (100 + 30 high-ench + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → premium 115 G (no high-enchantment surcharge)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 → premium 195 G (100 + 50 curse + 30 ench + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // === Policy-wide modifiers ===
  it("customer with exactly 2 years → loyalty discount applies (sword premium 95 G: 100 - 20 loyalty + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer's second quote in scenario → follow-up contract discount (sword 100 G: 100 - 15 follow + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // === Modifier scope on multi-item policies ===
  it("cursed sword + plain amulet, newcomer, first quote → 231 G (100+60 base + 50 curse + 16 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }, { type: "amulet" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // === Rounding ===
  it("premium calculation yielding 197.5 G → rounded up to 198 G (regression: 7 runes)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array(7).fill({ type: "rune" }) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("payout calculation yielding 350.5 G → rounded down to 350 G", () => {
    // ench 8 sword: 50% × 901 = 450.5; minus 100 deductible = 350.5 → rounds down to 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    // premium: 100 + 30 high-ench + 10 first + 5 fee = 145
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 350, remainingCap: 1650 }],
    });
  });

  // === Standard claim reimbursement ===
  it("regular sword, damage 500 G → payout 400 G (full minus 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("rune, damage 200 G → payout 100 G", () => {
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

  // === Enchantment threshold vs dragon material ===
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50 % rule wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // premium: 100 + 30 high-ench + 10 first + 5 fee = 145
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (dragon full then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    });
    // premium: 100 + 30 high-ench + 10 first + 5 fee = 145
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 700, remainingCap: 1300 }],
    });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50 % then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // premium: 100 base + 30 high-ench + 10 first + 5 fee = 145
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });
  it("dragon-material sword, enchantment 8, damage 1000 G → payout 400 G (high-enchantment then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    // premium: 100 + 30 high-ench + 10 first + 5 fee = 145
    expect(result).toEqual({
      results: [{ premium: 145 }, { payout: 400, remainingCap: 1600 }],
    });
  });

  // === Deductible per damage event ===
  it("dragon attack on sword (500) and amulet (300) → payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
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
    // premium: (100+60)+ 16 first + 5 fee = 181; cap = (1000+600)×2 = 3200
    // sword: 500-100=400; amulet: 300-100=200; total 600
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 600, remainingCap: 2600 }],
    });
  });

  // === Multiple items of the same type ===
  it("policy with two swords → cap 4000 G (insurance sum 2000 × 2)", () => {
    // Claim large enough to exhaust the cap: sword damage 5000 → 4900 raw, capped to 4000
    // Only one sword damage entry — but expect payout 4000 = min(4900, 4000)
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ],
    });
    // premium: 200 base + 20 first + 5 fee = 225; cap = 4000
    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 4000, remainingCap: 0 }],
    });
  });
  it("dragon attack damages both swords, two damage entries → each with its own deductible", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
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
    // Each sword damage: 500 - 100 = 400; total 800; cap 4000; premium 225
    expect(result).toEqual({
      results: [{ premium: 225 }, { payout: 800, remainingCap: 3200 }],
    });
  });
  it("damages array has more sword entries than policy insures → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: {
              cause: "dragon",
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

  // === Cap ===
  it("sword + amulet policy → cap 3200 G (insurance sum 1600 × 2)", () => {
    // Damage large enough to force cap: sword 5000 damage → 4900 raw; capped at 3200
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ],
    });
    // premium: 160 + 16 first + 5 fee = 181; cap 3200
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 3200, remainingCap: 0 }],
    });
  });
  it("cursed sword → cap 2000 G (unmodified insurance value)", () => {
    // Force large damage to exhaust cap; verify cap = 2×1000 (not affected by curse surcharge)
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 3000 }] },
        },
      ],
    });
    // premium: 100 + 50 curse + 10 first + 5 fee = 165; cap = 2000; payout = min(2900, 2000) = 2000
    expect(result).toEqual({
      results: [{ premium: 165 }, { payout: 2000, remainingCap: 0 }],
    });
  });
  it("sword + 3 runes (block) → insurance sum 1750 G, cap 3500 G (block does not affect sum)", () => {
    // Force cap: sword damage 5000 → cap 3500
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword" },
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
          ],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 5000 }] },
        },
      ],
    });
    // premium: 100 sword + 60 rune-block + 16 first + 5 fee = 181
    // cap: (1000 + 3×250) × 2 = 1750 × 2 = 3500; payout min(4900, 3500) = 3500
    expect(result).toEqual({
      results: [{ premium: 181 }, { payout: 3500, remainingCap: 0 }],
    });
  });

  // === Cap exhaustion across successive claims ===
  it("sword, two successive claims of 1500 G → first 1400/600, second 600/0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
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
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });

  // === Edge cases ===
  it("quote with unknown item type → runScenario throws (CLI exits non-zero)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references an uninsured item type → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim contains a damage with negative amount → runScenario throws", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });

  // === Integration examples ===
  it("newcomer with a cursed sword (steel, enchantment 3) → premium 165 G", () => {
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
  it("long-standing (3y) customer's second contract: cursed sword ench 7 → premium 160 G", () => {
    // 3 years → loyalty; first quote = anything; second quote = follow-up + cursed sword ench 7
    // Second quote: 100 base + 50 curse + 30 high-ench − 20 loyalty + 10 first − 15 follow-up = 155 + 5 fee = 160
    // First quote: pick something simple; irrelevant to assertion beyond making the second quote a follow-up
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    // First quote: 100 base − 20 loyalty + 10 first + 5 fee = 95
    expect(result.results[1]).toEqual({ premium: 160 });
  });
});
