import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ============================================================
  // Simplest cases: empty & processing fee
  // ============================================================
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // ============================================================
  // Base premiums for single main items (no modifiers)
  // ============================================================
  it("single sword → base 100 G + 10 first-ins + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet → base 60 G + 6 first-ins + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff → base 80 G + 8 first-ins + 5 fee = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion → base 40 G + 4 first-ins + 5 fee = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // ============================================================
  // Component premiums (runes, moonstones)
  // ============================================================
  it("1 rune → base 25 G + 2.5 first-ins + 5 fee = 33 G (round up from 32.5)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it.todo("2 runes → base 50 G + 5 first-ins + 5 fee = 60 G");
  it("3 runes → block base 60 + 6 first-ins + 5 fee = 71 G (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it.todo("4 runes → base 100 G + 5 G fee = 105 G (no block — requires exactly 3)");
  it.todo("7 runes → base 175 G + 5 G fee = 180 G");
  it("2 runes + 1 moonstone → base 75 + 7.5 first-ins + 5 fee = 87.5 → 88 G (no block: different types)", () => {
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
  it.todo("3 runes + 3 moonstones → base 120 G + 5 G fee = 125 G (two separate blocks)");

  // ============================================================
  // Item-specific modifiers: curse, high enchantment
  // ============================================================
  it("cursed sword, new customer → 100 base + 50 curse + 10 first-ins + 5 fee = 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword enchantment 5 → 100 base + 30 high-ench + 10 first-ins + 5 fee = 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it.todo("sword enchantment 4 → 100 + 5 fee = 105 G (no high-ench)");
  it.todo("cursed sword enchantment 5 → 100 + 50 + 30 + 5 fee = 185 G (both surcharges)");

  // ============================================================
  // Policy-wide modifiers on single item
  // ============================================================
  it("customer 2 years, single sword → 100 base + 10 first-ins − 20 loyalty + 5 fee = 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it.todo("customer with 3 years, single sword → loyalty −20 + first-insurance +10 + 5 fee = 95 G");
  it.todo("customer with 1 year, single sword → first-insurance +10 + 5 fee = 115 G (no loyalty)");

  // ============================================================
  // Follow-up contract (second quote in scenario)
  // ============================================================
  it("second quote in scenario → follow-up contract discount -15% applies (100 → second: 100 - 15 + 10 + 5 = 100 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });
  it.todo("first quote in a scenario → no follow-up discount");

  // ============================================================
  // Modifier scope on multi-item policies
  // ============================================================
  it.todo("cursed sword + plain amulet, new customer → 160 base + 50 curse + 16 first-ins + 5 fee = 231 G");

  // ============================================================
  // Rounding in MHPCO's favor
  // ============================================================
  it.todo("premium yielding 197.5 G → rounded UP to 198 G");
  it.todo("intermediate amounts are kept as fractions; only final is rounded");

  // ============================================================
  // Integration examples from spec
  // ============================================================
  it.todo("newcomer, cursed sword (steel, ench 3) → 165 G (100 + 50 curse + 10 first-ins + 5 fee)");
  it("3-yr customer 2nd quote, cursed sword ench 7 → 160 G (100 + 50 + 30 − 20 + 10 − 15 + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    }) as { results: Array<{ premium: number }> };
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // ============================================================
  // Unknown item type error
  // ============================================================
  it("quote with unknown item type (e.g. broomstick) → throws error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      }),
    ).toThrow();
  });

  // ============================================================
  // Claim: basic reimbursement (no special clauses)
  // ============================================================
  it("regular sword damage 500 → payout 400, remainingCap 1600 (cap 2000)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    }) as { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> };
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it.todo("damage to a rune (ins 250), damage 200 → payout 100 (full − 100 deductible)");

  // ============================================================
  // Claim: enchantment threshold
  // ============================================================
  it("steel sword ench 9 damage 1000 → payout 400 (50% then − 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "dragon", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    }) as { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> };
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it.todo("dragon-material sword, ench 8, damage 1000 → payout 400 (high-ench wins, then deductible)");

  // ============================================================
  // Claim: dragon material clause
  // ============================================================
  it.todo("dragon-material sword, ench 9, damage 1000 → payout 400 (50% rule wins, then deductible)");
  it.todo("dragon-material sword, ench 5, damage 800 → payout 700 (dragon: full − 100)");

  // ============================================================
  // Claim: deductible per damage event
  // ============================================================
  it("dragon attack damages sword (500) and amulet (300), both insured → payout 600 (deductible per damaged item)", () => {
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
    }) as { results: Array<{ payout?: number; remainingCap?: number }> };
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // ============================================================
  // Claim: multiple items of same type
  // ============================================================
  it.todo("policy covers two swords → insurance sum 2000, cap 4000");
  it.todo("policy covers two swords, damages array has two sword entries → each treated separately with its own deductible");
  it("two sword damages but only one sword insured → throws error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
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
      }),
    ).toThrow();
  });

  // ============================================================
  // Claim: cap and cap exhaustion
  // ============================================================
  it.todo("sword + amulet policy → insurance sum 1600, cap 3200");
  it.todo("cursed sword (premium 165) → cap 2000 (based on unmodified insurance value)");
  it.todo("sword + 3 runes block → insurance sum 1750 (block discount does not affect insurance sum)");
  it("sword cap 2000, first claim 1500 → payout 1400, remainingCap 600 (deductible 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    }) as { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> };
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword cap 2000, after 1st 1500 claim, 2nd 1500 → payout 600, remainingCap 0 (cap exhaustion)", () => {
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
          incident: { cause: "fire2", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    }) as { results: Array<{ premium?: number; payout?: number; remainingCap?: number }> };
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // ============================================================
  // Payout rounding (down)
  // ============================================================
  it.todo("payout calculation yielding 350.5 G → 350 G (rounded down)");

  // ============================================================
  // Claim error cases
  // ============================================================
  it("claim references damage to uninsured item → throws error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it("claim with negative damage → throws error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          {
            op: "claim",
            policy: 0,
            incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] },
          },
        ],
      }),
    ).toThrow();
  });
  it.todo("claim references damage with unknown item type → non-zero exit + stderr");
});
