import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ===== QUOTE: single main item, first insurance, no risk modifiers =====
  // Base premium + 10% first-insurance surcharge + 5 G fee
  it("quote: single sword for new customer (first insurance) — premium 115 G (100 base + 10% surcharge = 110, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote: single amulet for new customer (first insurance) — premium 71 G (60 base + 10% = 66, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote: single staff for new customer (first insurance) — premium 93 G (80 base + 10% = 88, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "staff", material: "wood", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote: single potion for new customer (first insurance) — premium 49 G (40 base + 10% = 44, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "potion", material: "glass", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // ===== QUOTE: single component, first insurance =====
  it("quote: single rune for new customer — premium 33 G (25 base + 10% = 27.5 -> 28, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quote: single moonstone for new customer — premium 33 G (25 base + 10% = 27.5 -> 28, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });

  // ===== QUOTE: building block of 3 alike components =====
  it("quote: 3 runes (building block) for new customer — premium 71 G (60 block base + 10% = 66, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote: 3 moonstones (building block) for new customer — premium 71 G (60 block base + 10% = 66, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote: 2 runes (not enough for block) for new customer — premium 60 G (2 × 25 = 50 base, +10% = 55, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote: 4 runes (one block of 3 + 1 leftover) for new customer — premium 99 G (60 block + 25 leftover = 85, +10% = 93.5 -> 94, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 99 }] });
  });
  it("quote: 3 mixed components (2 runes + 1 moonstone) — no block applies, premium 88 G (3 × 25 = 75, +10% = 82.5 -> 83, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "rune", material: "stone", enchantment: 0, cursed: false },
            { type: "moonstone", material: "stone", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });

  // ===== QUOTE: cursed item surcharge (+50%) =====
  it("quote: cursed sword for new customer — premium 170 G (100 base × 1.5 cursed = 150, × 1.1 first = 165, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 170 }] });
  });

  // ===== QUOTE: highly enchanted item (enchantment >= 5) surcharge (+30%) =====
  it("quote: sword with enchantment 5 for new customer — premium 148 G (100 × 1.3 = 130, × 1.1 = 143, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 5, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 148 }] });
  });
  it("quote: sword with enchantment 4 (below threshold) for new customer — premium 115 G (100 × 1.1 = 110, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 4, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // ===== QUOTE: cursed AND highly enchanted (both surcharges apply) =====
  it("quote: cursed sword with enchantment 7 for new customer — premium 220 G (100 × 1.5 × 1.3 = 195, × 1.1 = 214.5 -> 215, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 220 }] });
  });

  // ===== QUOTE: long-standing customer (yearsWithMHPCO >= 2) loyalty discount (-20%) =====
  it("quote: single sword for loyal customer (2 years), first insurance — premium 93 G (100 × 0.8 = 80, × 1.1 = 88, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote: single sword for customer with 1 year (below loyalty threshold) — premium 115 G (no loyalty discount)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 1 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });

  // ===== QUOTE: subsequent contract discount (-15% each after the first) =====
  it("quote: second quote for new customer gets -15% (no first-insurance surcharge) — second premium 90 G (100 × 0.85 = 85, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });
  it("quote: third quote for new customer also gets -15% — third premium 90 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { premium: 90 }, { premium: 90 }],
    });
  });

  // ===== QUOTE: multiple main items in one quote =====
  it("quote: sword + amulet for new customer — premium 181 G (100+60 = 160, × 1.1 = 176, +5 fee)", () => {
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

  // ===== QUOTE: combined modifiers - loyal customer + first insurance =====
  it("quote: sword for 5-year customer (first insurance) — premium 93 G (100 × 0.8 × 1.1 = 88, +5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });

  // ===== QUOTE: combined modifiers - loyal + cursed + enchanted on second contract =====
  it("quote: loyal customer's second quote with cursed enchanted sword — applies all modifiers (cursed × enchanted × loyalty × subsequent + fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 2 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 7, cursed: true },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }, { premium: 138 }] });
  });

  // ===== QUOTE: rounding in MHPCO's favor (round up) =====
  it("quote: verify rounding goes up (in MHPCO's favor) when premium would have a fractional G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "moonstone", material: "stone", enchantment: 5, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 42 }] });
  });

  // ===== CLAIM: enchantment >= 8 reimbursed at 50% =====
  it("claim: damage to item with enchantment 8, amount 400 G — payout 100 G (50% of 400 = 200, -100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 8, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          damages: [{ itemType: "sword", amount: 400 }],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 148 }, { payout: 100 }],
    });
  });
  it("claim: damage to item with enchantment 10, amount 1000 G — payout 400 G (50% of 1000 = 500, -100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 10, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          damages: [{ itemType: "sword", amount: 1000 }],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 148 }, { payout: 400 }],
    });
  });

  // ===== CLAIM: dragon material fully reimbursed =====
  it("claim: damage to dragon-material item, amount 500 G — payout 400 G (500 - 100 deductible)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          damages: [{ itemType: "sword", amount: 500 }],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 400 }],
    });
  });

  // ===== CLAIM: multiple damages share one deductible per incident =====
  it("claim: incident with multiple damages — one 100 G deductible per damage event (incident)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 8, cursed: false },
            { type: "staff", material: "dragon", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          damages: [
            { itemType: "sword", amount: 400 },
            { itemType: "staff", amount: 300 },
          ],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 263 }, { payout: 400 }],
    });
  });

  // ===== CLAIM: payout never negative =====
  it("claim: damage smaller than deductible yields payout 0 G (never negative)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "dragon", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          damages: [{ itemType: "sword", amount: 50 }],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 115 }, { payout: 0 }],
    });
  });

  // ===== INTEGRATION: quote then claim referencing earlier policy =====
  it("scenario: quote followed by claim against policy index 0 returns both premium and payout in results", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "amulet", material: "silver", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "claim",
          policy: 0,
          damages: [{ itemType: "amulet", amount: 200 }],
        },
      ],
    });
    expect(result).toEqual({
      results: [{ premium: 58 }, { payout: 0 }],
    });
  });

  // ===== INTEGRATION: multiple quotes affect subsequent-contract pricing =====
  it("scenario: two quotes - first gets +10% surcharge, second gets -15% discount", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 0, cursed: false },
          ],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }, { premium: 90 }] });
  });
});
