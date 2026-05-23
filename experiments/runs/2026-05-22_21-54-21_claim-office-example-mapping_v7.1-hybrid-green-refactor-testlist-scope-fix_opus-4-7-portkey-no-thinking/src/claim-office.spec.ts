import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Simplest cases
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums for main items (newcomer, 0 years, no prior contract → adds first-insurance 10% per item; we use long-standing 2yr customer second contract? Simplest: just look at base + fee with no modifiers — newcomer with single item has first-insurance. We'll exercise via integration examples)
  // Use unmodified single-item with a long-standing customer's follow-up contract so only base + fee + loyalty/follow-up. Simpler: test base premium math via the integration examples already in the spec.

  // Base premiums via building-block examples (components, base premium only)
  it("2 runes (newcomer, first quote) → premium 60 G (base 50 + 10% first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes (newcomer, first quote) → premium 71 G (block 60 + 10% first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes (newcomer, first quote) → premium 115 G (4×25=100 + 10% first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes (newcomer, first quote) → premium 198 G (base 175 + 10% = 192.5, +5 fee = 197.5 → 198 rounded up)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // Alike components — clarifying question
  it("2 runes + 1 moonstone (newcomer, first quote) → premium 88 G (3×25=75 no block, +10% = 82.5, +5 fee = 87.5 → 88)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones (newcomer, first quote) → premium 137 G (two blocks 60+60=120, +10% = 132, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "rune" }, { type: "rune" }, { type: "rune" },
          { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // Modifier scope on multi-item policies — clarifying question
  it("policy: cursed sword + plain amulet (newcomer) → premium 231 G (100+60 base + 50 curse + 16 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{
        op: "quote",
        items: [
          { type: "sword", cursed: true },
          { type: "amulet" },
        ],
      }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // Modifier thresholds
  it("2-year customer, single sword, first quote → premium 95 G (100 + 10 first-insurance − 20 loyalty + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("newcomer, sword enchantment 5 → premium 145 G (100 base + 30 high-enchant + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("newcomer, cursed sword enchantment 5 → premium 195 G (100 + 50 curse + 30 high-enchant + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("newcomer, sword enchantment 4 → premium 115 G (no high-enchant surcharge)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("newcomer, cursed sword enchantment 4 → premium 165 G (100 + 50 curse + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  // Rounding in MHPCO's favor (premium up, payout down)
  it("premium calculation yielding 197.5 G → 198 G (rounded up)", () => {
    // already validated by the 7-runes scenario which sums to 197.5
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });
  it("payout calculation yielding 350.5 G → 350 G (sword enchant 8, damage 901)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // Integration examples (premium)
  it("newcomer with cursed sword (steel, enchantment 3) → premium 165 G [integration]", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("3-year customer's 2nd contract, cursed sword enchant 7 → premium 160 G [integration]", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "amulet" }] }, // first contract (any prior quote)
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    expect((result as { results: { premium: number }[] }).results[1]).toEqual({ premium: 160 });
  });

  // Standard claim reimbursement (no special clauses)
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G, remainingCap 1600 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G, remainingCap 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "spill", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    // cap = 2 × 250 = 500; payout = 200 − 100 = 100; remainingCap = 500 − 100 = 400
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // High-enchantment claim clause
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Dragon material clause
  it("dragon sword, enchantment 5, damage 800 G → payout 700 G (full, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // Both clauses — 50% rule wins
  it("dragon sword, enchantment 9, damage 1000 G → payout 400 G (50% wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon sword, enchantment exactly 8, damage 1000 G → payout 400 G (high-enchantment then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // Deductible per damage event
  it("dragon attack: sword 500 + amulet 300 → payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ]}},
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // Multiple items of the same type
  it("policy with two swords → cap 4000 G (insurance sum 2000)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    // payout = 200 − 100 = 100; remainingCap = 4000 − 100 = 3900
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 3900 });
  });
  it("dragon attack damages both swords → two entries treated as separate damages", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ]}},
      ],
    });
    // each 500 − 100 deductible = 400; total payout 800; remainingCap = 4000 − 800 = 3200
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages contains more entries of a type than policy covers → throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] }, // only 1 sword insured
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 200 },
          { itemType: "sword", amount: 200 },
        ]}},
      ],
    })).toThrow();
  });

  // Cap calculation
  it("policy: sword + amulet → cap 3200 G (insurance sum 1600)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 150 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 50, remainingCap: 3150 });
  });
  it("cursed sword → cap 2000 G (based on unmodified insurance value, not premium)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("policy: sword + 3 runes (block) → cap 3500 G (block discount affects premium only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 150 }] } },
      ],
    });
    // cap = 2 × (1000 + 3×250) = 2 × 1750 = 3500; payout = 50; remainingCap = 3450
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 50, remainingCap: 3450 });
  });

  // Cap exhaustion across successive claims
  it("sword (cap 2000 G), first claim 1500 G → payout 1400 G, cap remaining 600 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword (cap 2000 G), two successive claims of 1500 each → 1400+600 payouts, cap exhausts", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    const results = (result as { results: unknown[] }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // Edge cases (CLI-level)
  it("quote includes unknown item type → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references item not in policy → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim with damage amount -200 → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
});
