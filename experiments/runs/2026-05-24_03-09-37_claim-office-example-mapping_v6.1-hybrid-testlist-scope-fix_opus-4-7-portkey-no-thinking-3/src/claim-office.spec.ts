import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Edge case: empty
  it("empty item list quote → premium 5 G (processing fee only)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums per item type
  it("quote for single sword for newcomer → 115 G (100 base + 10 first + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote for single amulet for newcomer → 71 G (60 base + 6 first + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for single staff for newcomer → 93 G (80 base + 8 first + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote for single potion for newcomer → 49 G (40 base + 4 first + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Component rules
  it("quote for 1 rune for newcomer → 33 G (25 base + 2.5 first + 5 fee = 32.5 → 33)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quote for 2 runes for newcomer → 60 G (50 base + 5 first + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote for 3 runes for newcomer → 71 G (60 block + 6 first + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote for 4 runes for newcomer → 115 G (100 base, no block + 10 first + 5 fee)", () => {
    const result = processScenario({
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
  it("quote for 7 runes for newcomer → 198 G (175 base + 17.5 first + 5 fee = 197.5 → 198)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // Alike clarification
  it("quote for 2 runes + 1 moonstone for newcomer → 88 G (75 base, no block + 7.5 first + 5 fee = 87.5 → 88)", () => {
    const result = processScenario({
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
  it("quote for 3 runes + 3 moonstones for newcomer → 137 G (120 base, two blocks + 12 first + 5 fee)", () => {
    const items = [
      { type: "rune" },
      { type: "rune" },
      { type: "rune" },
      { type: "moonstone" },
      { type: "moonstone" },
      { type: "moonstone" },
    ];
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Cursed surcharge
  it("cursed sword (steel, ench 3), newcomer → 165 G (100 + 50 curse + 10 first + 5 fee)", () => {
    const result = processScenario({
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

  // High enchantment surcharge
  it("sword enchantment 5 (not cursed), newcomer → 145 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword enchantment 4 (not cursed), newcomer → 115 G (no high-ench)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 4, cursed: false }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword enchantment 5, newcomer → 195 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 5, cursed: true }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // Loyalty
  it("loyalty applies at exactly 2 years (sword, first contract) → 95 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  // First insurance & follow-up
  it("second contract for long-standing customer (3 yrs) with cursed sword ench 7 → 160 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }],
        },
      ],
    });
    const results = (result as { results: Array<{ premium: number }> }).results;
    expect(results[1]).toEqual({ premium: 160 });
  });

  // Modifier scope on multi-item policies
  it("cursed sword + plain amulet, newcomer → 231 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", cursed: true },
            { type: "amulet" },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Rounding (premium up)
  it("premium calculation 197.5 G → 198 G (rounded up in MHPCO's favor)", () => {
    // 7 runes newcomer: 175 base + 17.5 first + 5 fee = 197.5 → 198
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // CLAIM examples
  // Standard reimbursement
  it("regular sword (steel, ench 3), damage 500 G → payout 400 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    });
    const results = (result as { results: Array<Record<string, number>> }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune (insurance 250), damage 200 G → payout 100 G", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spell", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    });
    const r = (result as { results: Array<Record<string, number>> }).results;
    expect(r[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // Enchantment threshold vs dragon material
  it("dragon sword ench 8, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "dragon", enchantment: 8 }],
        },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    });
    const r = (result as { results: Array<Record<string, number>> }).results;
    expect(r[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword ench 9, damage 1000 G → payout 400 G", () => {
    const result = processScenario({
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
    const r = (result as { results: Array<Record<string, number>> }).results;
    expect(r[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword ench 5, damage 800 G → payout 700 G", () => {
    const result = processScenario({
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
    const r = (result as { results: Array<Record<string, number>> }).results;
    expect(r[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword ench 9, damage 1000 G → payout 400 G", () => {
    const result = processScenario({
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
    const r = (result as { results: Array<Record<string, number>> }).results;
    expect(r[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Multiple damages
  it("dragon attack damaging sword (500) + amulet (300) → payout 600 G", () => {
    const result = processScenario({
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
    const r = (result as { results: Array<Record<string, number>> }).results;
    expect(r[1]).toEqual({ payout: 600, remainingCap: 3200 - 600 });
  });

  // Multiple items same type
  it("two swords insured → cap 4000 (insurance sum 2 × 1000)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    const r = (result as { results: Array<Record<string, number>> }).results;
    // 200 - 100 deductible = 100 payout; remaining cap = 4000 - 100 = 3900
    expect(r[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("two sword damages with two swords insured → each with own deductible", () => {
    const result = processScenario({
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
              { itemType: "sword", amount: 300 },
            ],
          },
        },
      ],
    });
    const r = (result as { results: Array<Record<string, number>> }).results;
    // (500-100) + (300-100) = 600
    expect(r[1]).toEqual({ payout: 600, remainingCap: 3400 });
  });
  it("two sword damages with only one sword insured → throws (rejected)", () => {
    expect(() =>
      processScenario({
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

  // Cap exhaustion
  it("sword + amulet policy → insurance sum 1600, cap 3200", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    });
    const r = (result as { results: Array<Record<string, number>> }).results;
    expect(r[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword cap is 2000 (unmodified insurance value); premium modifiers don't raise cap", () => {
    const result = processScenario({
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
    const r = (result as { results: Array<Record<string, number>> }).results;
    // payout 100-100=0, remainingCap = 2000
    expect(r[0]).toEqual({ premium: 165 });
    expect(r[1]).toEqual({ payout: 0, remainingCap: 2000 });
  });
  it("sword + 3 runes block → insurance sum 1750 (block discount doesn't affect insurance sum), cap 3500", () => {
    const result = processScenario({
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    });
    const r = (result as { results: Array<Record<string, number>> }).results;
    expect(r[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("sword cap 2000: claim 1500 → 1400/600, next 1500 → 600/0", () => {
    const result = processScenario({
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
    const r = (result as { results: Array<Record<string, number>> }).results;
    expect(r[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(r[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Rounding (payout down)
  it("payout 350.5 G → 350 G (rounded down in MHPCO's favor)", () => {
    // sword ench 8, damage 901 → 901*0.5 - 100 = 350.5 → 350
    const result = processScenario({
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
    const r = (result as { results: Array<Record<string, number>> }).results;
    expect(r[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Error cases
  it("quote with unknown item type → throws", () => {
    expect(() =>
      processScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });
  it("claim references item not in policy → throws", () => {
    expect(() =>
      processScenario({
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
  it("claim with negative damage amount → throws", () => {
    expect(() =>
      processScenario({
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
