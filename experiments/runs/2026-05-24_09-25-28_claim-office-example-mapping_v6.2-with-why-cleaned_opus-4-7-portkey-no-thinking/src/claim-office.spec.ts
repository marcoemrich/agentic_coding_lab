import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Empty / simplest cases ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums per main item type ---
  it("single plain sword → premium 115 G (100 base + 10 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single plain amulet → premium 71 G (60 base + 6 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single plain staff → premium 93 G (80 base + 8 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single plain potion → premium 49 G (40 base + 4 first insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components ---
  it("2 runes → 50 G base premium (+5 first insurance + 5 fee = 60)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies) (+6 first insurance + 5 fee = 71)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block) (+10 first insurance + 5 fee = 115)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium (+17.5 first insurance + 5 fee = 197.5 → 198)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- 'Alike' clarification ---
  it("2 runes + 1 moonstone → 75 G base premium (+7.5 first insurance + 5 fee = 87.5 → 88)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "moonstone" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base (two blocks) (+12 first insurance + 5 fee = 137)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers ---
  it("single cursed sword (steel, ench 3), newcomer first contract → 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with exactly enchantment 5 → high-enchantment surcharge applies (148 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 5, cursed: false },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge (115 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 4, cursed: false },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 → both surcharges apply (195 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 5, cursed: true },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers ---
  it("customer with exactly 2 years → loyalty discount applies (sword: 95 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });

  // --- Modifier scope on multi-item policy ---
  it("cursed sword + plain amulet → 231 G (cursed surcharge on cursed item only; 160 base + 50 curse + 16 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", cursed: true },
        { type: "amulet" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding ---
  it("premium calculation that yields a fractional value → rounded up (single rune: 32.5 → 33 G)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // --- Integration examples ---
  it("integration: newcomer with cursed sword (steel, ench 3) → 165 G (100 base + 50 curse + 10 first ins + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "sword", material: "steel", enchantment: 3, cursed: true },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second contract — cursed sword (steel, ench 7), 3 years → 160 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [
          { type: "sword", material: "steel", enchantment: 7, cursed: true },
        ] },
      ],
    });
    expect((result as { results: { premium: number }[] }).results[1]).toEqual({ premium: 160 });
  });

  // --- Claim: standard reimbursement ---
  it("regular sword damage 500 G → payout 400 G (full minus deductible), remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 G → payout 100 G (no special clause, deductible); remainingCap 400", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fall", damages: [
          { itemType: "rune", amount: 200 },
        ] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible per item); remainingCap 2600", () => {
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
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: enchantment vs dragon material ---
  it("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% wins, then deductible); remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [
          { itemType: "sword", amount: 1000 },
        ] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (dragon-material: full minus deductible); remainingCap 1300", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 800 },
        ] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword, enchantment 9, damage 1000 G → payout 400 G (50% then deductible); remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [
          { itemType: "sword", amount: 1000 },
        ] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment 8, damage 1000 G → payout 400 G (high-ench applies, then deductible); remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [
          { itemType: "sword", amount: 1000 },
        ] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Multiple items of same type ---
  it("policy covers two swords → insurance sum 2000 G, cap 4000 G; dragon attack damages both with separate deductibles", () => {
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
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });
  it("damages contains more entries of a type than policy covers → runScenario throws (CLI exits non-zero)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "dragon", damages: [
          { itemType: "sword", amount: 500 },
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    })).toThrow();
  });

  // --- Cap exhaustion ---
  it("policy: sword + amulet → insurance sum 1600 G (cap 3200 G); sword damage 500 G → remainingCap 2800", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 2800 });
  });
  it("cursed sword → cap 2000 G (based on unmodified insurance value); sword damage 500 G → remainingCap 1600", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("sword + 3 runes (block) → insurance sum 1750 G (block affects premium only); sword damage 500 G → remainingCap 3100", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [
          { type: "sword" },
          { type: "rune" }, { type: "rune" }, { type: "rune" },
        ] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 500 },
        ] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 400, remainingCap: 3100 });
  });
  it("sword, two successive claims of 1500 G each → first payout 1400 G, second 600 G; cap exhausted", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: 1500 },
        ] } },
        { op: "claim", policy: 0, incident: { cause: "fall", damages: [
          { itemType: "sword", amount: 1500 },
        ] } },
      ],
    });
    const results = (result as { results: unknown[] }).results;
    expect(results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Payout rounding ---
  it("payout calculation yielding 350.5 G → final payout 350 G (rounded down); sword ench 8, damage 901 → payout 350, remainingCap 1650", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "battle", damages: [
          { itemType: "sword", amount: 901 },
        ] } },
      ],
    });
    expect((result as { results: unknown[] }).results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Edge case errors ---
  it("quote with unknown item type → runScenario throws (CLI exits non-zero)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    })).toThrow();
  });
  it("claim references damage for item not in policy → runScenario throws (CLI exits non-zero)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "amulet", amount: 200 },
        ] } },
      ],
    })).toThrow();
  });
  it("claim has negative damage amount → runScenario throws (CLI exits non-zero)", () => {
    expect(() => runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [
          { itemType: "sword", amount: -200 },
        ] } },
      ],
    })).toThrow();
  });
});
