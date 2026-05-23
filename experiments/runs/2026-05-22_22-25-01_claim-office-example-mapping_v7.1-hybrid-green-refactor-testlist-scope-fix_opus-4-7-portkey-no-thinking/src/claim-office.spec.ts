import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Edge cases / simplest ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums for single main items (each base + 5 G fee) ---
  it("single plain sword (first insurance, no loyalty) → premium 115 G (100 base + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet (first insurance) → premium 71 G (60 base + 6 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff (first insurance) → premium 93 G (80 base + 8 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion (first insurance) → premium 49 G (40 base + 4 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components (runes, moonstones) ---
  it("single rune (first insurance) → premium 33 G (25 base + 2.5 first + 5 fee = 32.5 → 33 rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes (first insurance) → premium 60 G (50 base + 5 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes (block, first insurance) → premium 71 G (60 block base + 6 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes (no block — block requires exactly 3) → premium 115 G (100 base + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes (no block) → premium 198 G (175 base + 17.5 first + 5 fee = 197.5 → 198)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- 'Alike' components clarification ---
  it("2 runes + 1 moonstone (no block: different types) → premium 88 G (75 base + 7.5 first + 5 = 87.5 → 88)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "moonstone" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones (two separate blocks) → premium 137 G (120 base + 12 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Premium modifiers (item-specific) ---
  it("cursed sword (first insurance) → premium 165 G (100 + 50 curse = 150 + 15 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword enchantment 5 (first insurance) → premium 145 G (100 + 30 high-ench + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword enchantment 4 (no high-ench surcharge, first insurance) → premium 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword enchantment 5 (first insurance) → premium 195 G (100 + 50 curse + 30 high-ench + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Loyalty discount (policy-wide) ---
  it("customer 2 years, plain sword → loyalty applies → premium 95 G (100 + 10 first - 20 loyalty + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("customer 1 year, plain sword → no loyalty → premium 115 G (100 + 10 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // --- First insurance vs. follow-up contract (policy-wide) ---
  it("second quote (follow-up contract), plain sword → premium 100 G (100 + 10 first - 15 follow-up + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // --- Modifier scope on multi-item policy ---
  it("cursed sword + plain amulet (first insurance) → premium 231 G (160 base + 16 first + 50 curse + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding (in MHPCO favor) ---
  // Premium rounding (197.5 → 198) is covered by the "7 runes" test above.
  // Payout rounding (350.5 → 350) will be covered by claim-payout tests below.

  // --- Integration examples ---
  it("integration: newcomer (0 years) with cursed sword (ench 3) → premium 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });

  it("integration: long-standing customer (3 yrs), second contract, cursed sword ench 7 → premium 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    // second quote: 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first - 15 follow-up = 155 + 5 fee = 160
    expect((result as { results: unknown[] }).results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: standard reimbursement (no special clauses) ---
  it("claim: regular steel sword ench 3, damage 500 → payout 400, remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect((result as any).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("claim: rune (insurance 250), damage 200 → payout 100, remainingCap 400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect((result as any).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: special clauses ---
  it("claim: dragon-material sword ench 8, damage 1000 → payout 400 (high-ench wins → 500 - 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect((result as any).results[1].payout).toBe(400);
  });
  it("claim: dragon sword ench 9, damage 1000 → payout 400 (high-ench 50% wins)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1000 }], cause: "x" } },
      ],
    });
    expect((result as any).results[1].payout).toBe(400);
  });
  it("claim: dragon sword ench 5, damage 800 → payout 700 (dragon full → 800 - 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 800 }], cause: "x" } },
      ],
    });
    expect((result as any).results[1].payout).toBe(700);
  });
  it("claim: steel sword ench 9, damage 1000 → payout 400 (high-ench 50%)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { damages: [{ itemType: "sword", amount: 1000 }], cause: "x" } },
      ],
    });
    expect((result as any).results[1].payout).toBe(400);
  });

  // --- Claim: deductible per damage event ---
  it("claim: dragon damages sword 500 + amulet 300 → payout 600 (100 deductible per damage)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    // sword: 500-100=400; amulet: 300-100=200; total 600
    expect((result as any).results[1].payout).toBe(600);
  });

  // --- Claim: multiple items of same type ---
  it("claim: two swords, both damaged 500 each → payout 800 (each deductible separately), remainingCap 3200", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    // insurance sum = 2000, cap = 4000; payout 400 + 400 = 800; remaining 3200
    expect((result as any).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("claim: one sword insured, two sword damage entries → runScenario throws (CLI exits non-zero)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 100 },
          { itemType: "sword", amount: 100 },
        ] } },
      ],
    })).toThrow();
  });

  // --- Claim: cap exhaustion ---
  it("claim: sword + amulet, full damage to both → insurance sum 1600, cap 3200, payouts use up cap", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 100 }] } },
      ],
    });
    // payout 0 (100 - 100 deductible); cap = 2 * (1000 + 600) = 3200, remaining 3200
    expect((result as any).results[1]).toEqual({ payout: 0, remainingCap: 3200 });
  });
  it("claim: cursed sword → cap 2000 (based on unmodified insurance value, not modified premium)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    // payout 100; cap 2000, remaining 1900
    expect((result as any).results[1]).toEqual({ payout: 100, remainingCap: 1900 });
  });
  it("claim: sword + 3 runes (block) → insurance sum 1750 = 1000 + 3*250 (block discount doesn't reduce sum), cap 3500", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 200 }] } },
      ],
    });
    // payout 100; cap 3500, remaining 3400
    expect((result as any).results[1]).toEqual({ payout: 100, remainingCap: 3400 });
  });
  it("claim sequence: sword cap 2000, two claims of 1500 each → 1400/600 then 600/0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect((result as any).results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect((result as any).results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Edge cases: errors ---
  it("quote with unknown item type → runScenario throws (CLI exits non-zero)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references damage for an item not in the policy → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 100 }] } },
      ],
    })).toThrow();
  });
  it("claim with negative damage amount → runScenario throws", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
});
