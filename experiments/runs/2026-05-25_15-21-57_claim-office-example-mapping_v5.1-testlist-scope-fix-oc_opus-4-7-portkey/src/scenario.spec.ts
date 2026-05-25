import { describe, it, expect } from "vitest";
import { runScenario } from "./scenario.js";

describe("MHPCO scenario engine", () => {
  // --- Edge case: empty policy ---
  it("empty item list -> premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums per item type (single item, 0-year customer, first quote) ---
  it("single sword (steel, ench 3) -> 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet (silver, ench 0) -> 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff (wood, ench 0) -> 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion -> 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Component pricing & block of 3 alike ---
  it("2 runes -> 60 G (50 base + 5 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes -> 71 G (60 base block + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes -> 115 G (100 base + 10 first insurance + 5 fee, no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 4 }, () => ({ type: "rune" })) }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes -> 198 G (175 base + 17.5 first insurance => 192.5 + 5 fee => round up to 198)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- 'Alike' components clarification ---
  it("2 runes + 1 moonstone -> 88 G (75 base + 7.5 first insurance => 82.5 + 5 fee => 88)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones -> 137 G (120 base block+block + 12 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Modifier scope (per-item vs policy-wide) ---
  it("policy with cursed sword + plain amulet (0 yrs, first quote) -> 231 G (160 base + 50 curse + 16 first + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
        { type: "amulet", material: "silver", enchantment: 2, cursed: false },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Modifier thresholds ---
  it("customer with exactly 2 years (plain sword, first quote) -> 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("sword with exactly enchantment 5 (0 yrs) -> 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("cursed sword with enchantment 5 (0 yrs) -> 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });
  it("sword with enchantment 4, not cursed -> 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // --- Integration examples ---
  it("newcomer with cursed sword (steel, ench 3) -> 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer 2nd quote, cursed sword (steel, ench 7) -> 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    });
    // first quote irrelevant; second must be 160
    expect((result as { results: { premium: number }[] }).results[1]).toEqual({ premium: 160 });
  });

  // --- Rounding ---
  it("premium with fraction is rounded up to whole G in MHPCO's favor (e.g. 197.5 -> 198)", () => {
    // 7 runes, 0-yr customer, first quote: 175 base + 17.5 first-insurance + 5 fee = 197.5 -> 198
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: Array.from({ length: 7 }, () => ({ type: "rune" })) }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- Claim: standard reimbursement ---
  it("steel sword (ench 3), damage 500 G -> payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    const results = (result as { results: { premium?: number; payout?: number; remainingCap?: number }[] }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 2000 - 400 });
  });
  it("rune damage 200 G -> payout 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    const results = (result as { results: { premium?: number; payout?: number; remainingCap?: number }[] }).results;
    expect(results[1]).toEqual({ payout: 100, remainingCap: 500 - 100 });
  });

  // --- Claim: high-enchantment clause ---
  it("steel sword ench 9, damage 1000 G -> payout 400 G (50% then -100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    const results = (result as { results: { payout?: number; remainingCap?: number }[] }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 2000 - 400 });
  });
  it("dragon sword ench 8, damage 1000 G -> payout 400 G (high ench 50% wins, then -100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    const results = (result as { results: { payout?: number; remainingCap?: number }[] }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 2000 - 400 });
  });

  // --- Claim: dragon material clause ---
  it("dragon sword ench 5, damage 800 G -> payout 700 G (full - 100)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    const results = (result as { results: { payout?: number; remainingCap?: number }[] }).results;
    expect(results[1]).toEqual({ payout: 700, remainingCap: 2000 - 700 });
  });
  it("dragon sword ench 9, damage 1000 G -> payout 400 G (50% wins over full)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    const results = (result as { results: { payout?: number; remainingCap?: number }[] }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 2000 - 400 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages sword (500) and amulet (300) -> payout 600 G (deductible per item)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "amulet", amount: 300 },
        ] } },
      ],
    });
    const results = (result as { results: { payout?: number; remainingCap?: number }[] }).results;
    // payouts: (500-100) + (300-100) = 600; cap = 2*(1000+600)=3200; remaining = 2600
    expect(results[1]).toEqual({ payout: 600, remainingCap: 3200 - 600 });
  });

  // --- Claim: payout rounding (rounded down, MHPCO's favor) ---
  it("payout calculation yielding fraction is rounded down to whole G (e.g. 350.5 -> 350)", () => {
    // sword ench 8: damage 901 -> 450.5 reimbursement - 100 deductible = 350.5 -> 350
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    const results = (result as { results: { payout?: number; remainingCap?: number }[] }).results;
    expect(results[1]).toEqual({ payout: 350, remainingCap: 2000 - 350 });
  });

  // --- Multiple items of the same type ---
  it("policy with two swords -> insurance sum 2000 G, cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    const results = (result as { results: { payout?: number; remainingCap?: number }[] }).results;
    // payouts: (500-100)+(500-100)=800; cap=4000; remaining=3200
    expect(results[1]).toEqual({ payout: 800, remainingCap: 4000 - 800 });
  });
  it("dragon attack damages two swords (separate entries) -> each entry its own deductible", () => {
    // Two dragon-material swords. Damage 300 each -> full 300 each, minus 100 deductible each = 200+200 = 400.
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "dragon", enchantment: 3, cursed: false },
          { type: "sword", material: "dragon", enchantment: 3, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 300 },
          { itemType: "sword", amount: 300 },
        ] } },
      ],
    });
    const results = (result as { results: { payout?: number; remainingCap?: number }[] }).results;
    expect(results[1]).toEqual({ payout: 400, remainingCap: 4000 - 400 });
  });

  // --- Cap exhaustion ---
  it("cursed sword -> cap 2000 G (based on unmodified insurance value)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 100000 }] } },
      ],
    });
    const results = (result as { results: { payout?: number; remainingCap?: number }[] }).results;
    // payout capped at 2000
    expect(results[1]).toEqual({ payout: 2000, remainingCap: 0 });
  });
  it("policy with sword + amulet -> insurance sum 1600 G, cap 3200 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "amulet", material: "silver", enchantment: 0, cursed: false },
        ] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 100000 }] } },
      ],
    });
    const results = (result as { results: { payout?: number; remainingCap?: number }[] }).results;
    expect(results[1]).toEqual({ payout: 3200, remainingCap: 0 });
  });
  it("policy with sword + 3 runes (block) -> insurance sum 1750 G, cap 3500 G (block discount only affects premium)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 3, cursed: false },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 100000 }] } },
      ],
    });
    const results = (result as { results: { payout?: number; remainingCap?: number }[] }).results;
    expect(results[1]).toEqual({ payout: 3500, remainingCap: 0 });
  });
  it("sword cap 2000 G, two successive 1500 G claims -> 1400 then 600, remaining 600 then 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    const results = (result as { results: { payout?: number; remainingCap?: number }[] }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Invalid input (runScenario throws) ---
  it("quote with unknown item type throws an error", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references item type not in policy throws an error", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "amulet", amount: 200 }] } },
      ],
    })).toThrow();
  });
  it("claim with more damage entries of a type than insured throws an error", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [
          { itemType: "sword", amount: 200 },
          { itemType: "sword", amount: 200 },
        ] } },
      ],
    })).toThrow();
  });
  it("claim with negative damage amount throws an error", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
        { op: "claim", policy: 0, incident: { cause: "x", damages: [{ itemType: "sword", amount: -200 }] } },
      ],
    })).toThrow();
  });
});
