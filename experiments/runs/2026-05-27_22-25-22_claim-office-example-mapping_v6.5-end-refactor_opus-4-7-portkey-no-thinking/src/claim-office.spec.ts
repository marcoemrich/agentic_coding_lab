import { describe, it, expect } from "vitest";
import { run } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Empty / simplest
  it("empty item list quote → premium 5 G (only processing fee)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums for main items: base + 10% first-insurance + 5 fee
  it("quote single sword → 100 + 10 first-ins + 5 fee = 115 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote single amulet → 60 + 6 first-ins + 5 fee = 71 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote single staff → 80 + 8 first-ins + 5 fee = 93 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote single potion → 40 + 4 first-ins + 5 fee = 49 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Component base premiums
  it("quote single rune → 25 + 2.5 first-ins + 5 fee = 32.5 → 33 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quote single moonstone → 25 + 2.5 first-ins + 5 fee = 32.5 → 33 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // Block of 3 alike components
  it("quote 2 runes → 50 + 5 first-ins + 5 fee = 60 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote 3 runes → 60 (block) + 6 first-ins + 5 fee = 71 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote 4 runes → 100 + 10 first-ins + 5 fee = 115 G (no block)", () => {
    const result = run({
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
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote 7 runes → 175 + 17.5 first-ins + 5 fee = 197.5 → 198 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // Alike components — different types do not form a block together
  it("quote 2 runes + 1 moonstone → 75 + 7.5 first-ins + 5 fee = 87.5 → 88 G", () => {
    const result = run({
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
  it("quote 3 runes + 3 moonstones → 120 (two blocks) + 12 first-ins + 5 fee = 137 G", () => {
    const result = run({
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


  // High enchantment item-specific
  it("quote sword enchantment 5 → 100 + 30 high-enchant + 10 first-ins + 5 fee = 145 G (threshold)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5 }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("quote sword enchantment 4 → 100 + 10 first-ins + 5 fee = 115 G (below threshold)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote cursed sword enchantment 5 → 100 + 50 curse + 30 high-ench + 10 first-ins + 5 fee = 195 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 5, cursed: true }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // Policy-wide modifiers
  it("quote cursed sword + plain amulet → 160 base + 50 curse + 16 first-ins + 5 fee = 231 G", () => {
    const result = run({
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
  it("quote single sword with customer 2 years → 100 - 20 loyalty + 10 first-ins + 5 fee = 95 G (threshold)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("second quote in scenario gets follow-up contract discount → 100 + 10 first ins - 15 follow-up + 5 = 100 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 100 }],
    });
  });

  // Rounding in MHPCO's favor
  it("premium calculation yielding 197.5 G → rounded up to 198 G (7 moonstones)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "moonstone" })),
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // Integration examples
  it("newcomer with cursed sword (steel, ench 3) → 165 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second contract: cursed sword ench 7 → 160 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 41 }, { premium: 160 }],
    });
  });

  // Unknown item type
  it("quote with unknown item type throws", () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });

  // Claims — standard reimbursement
  it("claim regular sword damage 500 → payout 400 (full minus 100 deductible)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3 }],
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
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("claim rune damage 200 → payout 100 (full minus 100 deductible)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "explosion",
            damages: [{ itemType: "rune", amount: 200 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 33 },
        { payout: 100, remainingCap: 400 },
      ],
    });
  });

  // Claims — enchantment >= 8 (50%)
  it("claim steel sword ench 9 damage 1000 → payout 400 (50% then deductible)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  // Claims — dragon material full
  it("claim dragon sword ench 5 damage 800 → payout 700 (full then deductible)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 5 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 800 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 700, remainingCap: 1300 },
      ],
    });
  });

  // Claims — both clauses, 50% wins
  it("claim dragon sword ench 9 damage 1000 → payout 400 (50% wins, then deductible)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 9 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });
  it("claim dragon sword ench 8 damage 1000 → payout 400 (high-ench threshold then deductible)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "fire",
            damages: [{ itemType: "sword", amount: 1000 }],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 400, remainingCap: 1600 },
      ],
    });
  });

  // Deductible per damaged item
  it("dragon attack damaging sword 500 + amulet 300 → payout 600 (deductible per item)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "amulet" }],
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
      results: [
        { premium: 181 },
        { payout: 600, remainingCap: 2600 },
      ],
    });
  });

  // Multiple items same type
  it("policy with two swords, two sword damages → both processed separately", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }, { type: "sword" }],
        },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon attack",
            damages: [
              { itemType: "sword", amount: 600 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 225 },
        { payout: 800, remainingCap: 3200 },
      ],
    });
  });
  it("claim with more damages of a type than insured → throws", () => {
    expect(() =>
      run({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          {
            op: "quote",
            items: [{ type: "sword" }],
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
    ).toThrow();
  });

  // Cap exhaustion
  it("sword cap 2000; two claims 1500 each → first payout 1400 cap 600, second payout 600 cap 0", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword" }],
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
    expect(result).toEqual({
      results: [
        { premium: 115 },
        { payout: 1400, remainingCap: 600 },
        { payout: 600, remainingCap: 0 },
      ],
    });
  });
  it("cap based on unmodified insurance value (cursed sword cap 2000)", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", cursed: true }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 2500 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 165 },
        { payout: 2000, remainingCap: 0 },
      ],
    });
  });
  it("sword + 3 runes insurance sum 1750 (block discount doesn't affect insurance sum)", () => {
    const result = run({
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 4000 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 181 },
        { payout: 3500, remainingCap: 0 },
      ],
    });
  });

  // Claims — payout rounding (down in MHPCO's favor)
  it("payout calculation yielding 350.5 G → rounded down to 350 G", () => {
    const result = run({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    });
    expect(result).toEqual({
      results: [
        { premium: 145 },
        { payout: 350, remainingCap: 1650 },
      ],
    });
  });

  // Claims — errors
  it("claim for item not in policy throws", () => {
    expect(() =>
      run({
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
  it("claim with negative damage amount throws", () => {
    expect(() =>
      run({
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
});
