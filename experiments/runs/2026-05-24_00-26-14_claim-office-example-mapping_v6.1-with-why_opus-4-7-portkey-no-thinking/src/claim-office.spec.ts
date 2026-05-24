import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Edge case: empty quote ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Single-item base premiums + processing fee ---
  it("quote with a single plain sword → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote with a single plain amulet → premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote with a single plain staff → premium 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote with a single plain potion → premium 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components ---
  it("quote with a single rune → premium 33 G (25 base + 2.5 first-insurance + 5 fee, rounded up)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quote with 2 runes → 50 base + 5 first-insurance + 5 fee = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote with 3 runes (block) → 60 base + 6 first-insurance + 5 fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote with 4 runes → 100 base + 10 first-insurance + 5 fee = 115 G (no block — block requires exactly 3)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote with 7 runes → 175 base + 17.5 first-insurance + 5 fee = 198 G (rounded up)", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- 'Alike' clarification ---
  it("quote with 2 runes + 1 moonstone → 75 base + 7.5 first-insurance + 5 fee = 88 G (no block — different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "moonstone" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("quote with 3 runes + 3 moonstones → 120 base + 12 first-insurance + 5 fee = 137 G (two separate blocks)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [
        { type: "rune" }, { type: "rune" }, { type: "rune" },
        { type: "moonstone" }, { type: "moonstone" }, { type: "moonstone" },
      ] }],
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Item-specific modifiers in isolation ---
  it("cursed sword (no other modifiers) → 100 base + 50 curse + 10 first-insurance + 5 fee = 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword with enchantment 5 → 100 base + 30 high-enchantment + 10 first-insurance + 5 fee = 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword with enchantment 4 → no high-enchantment surcharge → 115 G (100 + 10 first-insurance + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", enchantment: 4 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword with enchantment 5 → both surcharges → 100 + 50 + 30 + 10 + 5 = 195 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 5 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Policy-wide modifiers in isolation ---
  it("loyalty discount: 2-year customer, plain sword → 100 + 10 first-insurance − 20 loyalty + 5 fee = 95 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 95 }] });
  });
  it("first insurance surcharge: 0-year, plain sword (first quote) → 100 + 10 + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("follow-up contract discount: second quote in scenario, plain sword (0-year) → 100 + 10 − 15 + 5 = 100 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 100 }] });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet → 160 base + 50 curse (sword only) + 16 first-insurance + 5 fee = 231 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true }, { type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding ---
  it("premium calculation yielding 197.5 G → final 198 G (rounded up in MHPCO's favor)", () => {
    // 7 runes: 175 base + 17.5 first-insurance + 5 fee = 197.5 → 198
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items }],
    });
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- Integration examples ---
  it("newcomer with cursed sword (0 yrs, enchantment 3) → 165 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", cursed: true, enchantment: 3 }] }],
    });
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("long-standing customer's second quote: cursed sword enchantment 7 (3 yrs) → 160 G", () => {
    // First quote: plain potion (40 + 4 first-insurance - 8 loyalty + 5 fee = 41)
    // Second quote: cursed sword enchantment 7: 100 + 50 + 30 - 20 + 10 - 15 + 5 = 160
    const result = runScenario({
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword", cursed: true, enchantment: 7 }] },
      ],
    });
    expect(result.results[1]).toEqual({ premium: 160 });
  });

  // --- Error handling for quote ---
  it("quote with unknown item type (e.g. broomstick) → throws error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
      })
    ).toThrow();
  });

  // --- Claim: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 G → payout 400 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damaged 200 G → payout 100 G (no special clauses; deductible applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "rune", amount: 200 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claim: deductible per damage event ---
  it("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible applied per item)", () => {
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
    expect(result.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claim: special clauses ---
  it("dragon-material sword enchantment 8, damage 1000 G → payout 400 G (50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 9, damage 1000 G → payout 400 G (50% rule wins, then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword enchantment 5, damage 800 G → payout 700 G (full dragon reimbursement minus deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });
  it("steel sword enchantment 9, damage 1000 G → payout 400 G (high-enchantment 50% then deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claim: cap ---
  it("policy with sword and amulet → insurance sum 1600 G, cap 3200 G (exposed via remainingCap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 2800 });
  });
  it("cursed sword (insurance value 1000 G, modified premium 165 G) → cap 2000 G (premium modifiers don't raise cap)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 165 });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("policy with sword and 3 runes (block) → insurance sum 1750 G (block discount doesn't affect insurance sum)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3100 });
  });

  // --- Cap exhaustion across successive claims ---
  it("sword (cap 2000 G), two successive claims of 1500 G each → 1st payout 1400, remaining 600; 2nd payout 600, remaining 0", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(result.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Multiple items of same type ---
  it("policy covers two swords → insurance sum 2000 G, cap 4000 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] } },
      ],
    });
    expect(result.results[1]).toEqual({ payout: 400, remainingCap: 3600 });
  });
  it("dragon attack damages both swords (two sword damages) → each treated as separate damage with its own deductible", () => {
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
    expect(result.results[1]).toEqual({ payout: 800, remainingCap: 3200 });
  });

  // --- Claim error handling ---
  it("damages contains more entries of a type than insured → claim rejected (error)", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [
            { itemType: "sword", amount: 500 },
            { itemType: "sword", amount: 500 },
          ] } },
        ],
      })
    ).toThrow();
  });
  it("claim references item not in policy → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [
            { itemType: "amulet", amount: 200 },
          ] } },
        ],
      })
    ).toThrow();
  });
  it("claim damage entry with negative amount → error", () => {
    expect(() =>
      runScenario({
        customer: { yearsWithMHPCO: 0 },
        steps: [
          { op: "quote", items: [{ type: "sword" }] },
          { op: "claim", policy: 0, incident: { cause: "fire", damages: [
            { itemType: "sword", amount: -200 },
          ] } },
        ],
      })
    ).toThrow();
  });

  // --- Payout rounding ---
  it("payout calculation yielding 350.5 G → final 350 G (rounded down in MHPCO's favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 8 }] },
        { op: "claim", policy: 0, incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] } },
      ],
    });
    const claimResult = result.results[1] as { payout: number; remainingCap: number };
    expect(claimResult.payout).toBe(350);
  });
});
