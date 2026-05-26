import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest case ---
  it("empty item list → premium 5 G (only processing fee)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums for main items (with 5G fee, no other modifiers, customer is newcomer with first contract → 10% first-insurance surcharge applies) ---
  // To isolate base premium tests, we use a long-standing customer's follow-up contract? Actually simpler: use 0 years + first contract = first insurance surcharge applies.
  // Let's add tests for each item type as single-item quotes with surcharges applied.
  it("single sword (steel, enchantment 3, not cursed), newcomer, first contract → 100 base + 10 first-insurance + 5 fee = 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet (silver, enchantment 2, not cursed), newcomer, first contract → 60 + 6 + 5 = 71 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff (wood, enchantment 1, not cursed), newcomer, first contract → 80 + 8 + 5 = 93 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 1, cursed: false }],
        },
      ],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion (glass, not cursed), newcomer, first contract → 40 + 4 + 5 = 49 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", cursed: false }],
        },
      ],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components (runes, moonstones) ---
  it("1 rune, newcomer, first contract → 25 + 2.5 + 5 = 33 G (rounded up)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 33 }] });
  });
  it("2 runes → 50 G base premium (no block); newcomer, first contract → 50 + 5 + 5 = 60 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies); newcomer first contract → 60 + 6 + 5 = 71 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base (no block); newcomer first contract → 100 + 10 + 5 = 115 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base (no block); newcomer first → 175 + 17.5 + 5 = 198 G", () => {
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 198 }] });
  });

  // --- Alike components clarification (❓) ---
  it("2 runes + 1 moonstone → 75 G base (no block: different types); newcomer first → 75 + 7.5 + 5 = 88 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }] }],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base (two blocks); newcomer first → 120 + 12 + 5 = 137 G", () => {
    const input = {
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
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Cursed surcharge ---
  it("cursed sword (steel, enchantment 3), newcomer, first contract → 100 + 50 curse + 10 first = 160 + 5 fee = 165 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 165 }] });
  });

  // --- High enchantment surcharge ---
  it("sword enchantment 5 (not cursed), newcomer, first contract → 100 + 30 + 10 = 140 + 5 = 145 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }] },
      ],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword enchantment 4 (not cursed), newcomer, first contract → 115 G (no surcharge)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }] },
      ],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 115 }] });
  });
  it("cursed sword enchantment 5, newcomer, first contract → 195 G (both surcharges)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 5, cursed: true }] },
      ],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 195 }] });
  });

  // --- Loyalty discount threshold ---
  it("customer with exactly 2 years, single sword, first contract → 95 G (loyalty applies)", () => {
    const input = {
      customer: { yearsWithMHPCO: 2 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] },
      ],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 95 }] });
  });

  // --- Modifier scope on multi-item policies ---
  it("cursed sword + plain amulet, newcomer, first contract → 231 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "sword", material: "steel", enchantment: 3, cursed: true },
            { type: "amulet", material: "silver", enchantment: 2, cursed: false },
          ],
        },
      ],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 231 }] });
  });

  // --- Rounding in MHPCO favor (premium rounds up) ---
  it("premium calculation yielding 197.5 → final premium 198 G (rounded up)", () => {
    // 7 runes: base 175; +17.5 first-insurance → 192.5; +5 fee = 198 (197.5 before fee + 5)
    // Actually: ceil(175 + 17.5) = 193 → + 5 = 198 ✓
    const items = Array.from({ length: 7 }, () => ({ type: "rune" }));
    const input = { customer: { yearsWithMHPCO: 0 }, steps: [{ op: "quote", items }] };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 198 }] });
  });

  // --- Integration example: newcomer with cursed sword ---
  it("newcomer (0 years), cursed sword (steel, enchantment 3), first contract → 165 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }] }],
    };
    const output = runScenario(input);
    expect(output).toEqual({ results: [{ premium: 165 }] });
  });

  // --- Integration example: long-standing customer's second contract ---
  it("3-year customer's second quote: cursed sword enchantment 7 → 160 G (follow-up discount applies)", () => {
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion", material: "glass", cursed: false }] },
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 7, cursed: true }] },
      ],
    };
    const output = runScenario(input) as { results: { premium: number }[] };
    expect(output.results[1]).toEqual({ premium: 160 });
  });

  // --- First-insurance applies per item, even on follow-up contract (❓) ---
  it("follow-up contract still gets first-insurance surcharge per item (clarification from integration example)", () => {
    // 3-year customer, follow-up quote of plain sword: 100 base - 20 loyalty + 10 first - 15 follow-up = 75 + 5 = 80
    const input = {
      customer: { yearsWithMHPCO: 3 },
      steps: [
        { op: "quote", items: [{ type: "potion" }] },
        { op: "quote", items: [{ type: "sword" }] },
      ],
    };
    const output = runScenario(input) as { results: { premium: number }[] };
    expect(output.results[1]).toEqual({ premium: 80 });
  });

  // --- Claims: standard reimbursement ---
  it("regular sword (steel, enchantment 3), damage 500 → payout 400 (500 - 100 deductible)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 500 }] },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("rune damage 200 → payout 100 (no special clause; 200 - 100 deductible)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "spill", damages: [{ itemType: "rune", amount: 200 }] },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 400 });
  });

  // --- Claims: dragon material ---
  it("dragon-material sword, enchantment 5, damage 800 → payout 700 (full reimbursement minus deductible)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 5 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 800 }] },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 700, remainingCap: 1300 });
  });

  // --- Claims: high enchantment (≥8) ---
  it("steel sword, enchantment 9, damage 1000 → payout 400 (50% then deductible)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "steel", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claims: dragon material AND enchantment ≥ 8 (50% wins) ---
  it("dragon-material sword, enchantment 9, damage 1000 → payout 400 (50% wins, then deductible)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });
  it("dragon-material sword, enchantment exactly 8, damage 1000 → payout 400 (high-enchantment clause applies, then deductible)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", material: "dragon", enchantment: 8 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1000 }] },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 400, remainingCap: 1600 });
  });

  // --- Claims: deductible per damage event (per item) ---
  it("dragon attack damaging sword 500 + amulet 300 → payout 600 (deductible applies per item: 400 + 200)", () => {
    const input = {
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
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 600, remainingCap: 2600 });
  });

  // --- Claims: cap = 2x insurance sum ---
  it("policy covering sword + amulet → insurance sum 1600 G, cap 3200 G", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "amulet" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 200 }] },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 100, remainingCap: 3100 });
  });
  it("cursed sword (insurance value 1000) → cap 2000 G (cap based on unmodified value)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", cursed: true }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 200, remainingCap: 1800 });
  });
  it("sword + 3 runes (block) → insurance sum 1750 G (block discount doesn't affect sum)", () => {
    const input = {
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
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 200, remainingCap: 3300 });
  });

  // --- Cap exhaustion across multiple claims ---
  it("sword (cap 2000), claim 1 of 1500 → payout 1400, remainingCap 600", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 1500 }] },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
  });
  it("sword (cap 2000), claim 1 of 1500 then claim 2 of 1500 → payout 1400 then 600, remainingCap 600 then 0", () => {
    const input = {
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
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 1400, remainingCap: 600 });
    expect(output.results[2]).toEqual({ payout: 600, remainingCap: 0 });
  });

  // --- Rounding payout down (MHPCO favor) ---
  it("payout calculation yielding 350.5 → final payout 350 G (rounded down)", () => {
    // sword enchantment 9, damage 901 → 901 * 0.5 - 100 = 350.5 → 350
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword", enchantment: 9 }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 901 }] },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 350, remainingCap: 1650 });
  });

  // --- Multiple items of same type (❓) ---
  it("policy with two swords → insurance sum 2000, cap 4000", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }, { type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "sword", amount: 300 }] },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 200, remainingCap: 3800 });
  });
  it("dragon attack damages both swords (two damage entries) → each gets its own deductible", () => {
    const input = {
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
              { itemType: "sword", amount: 600 },
            ],
          },
        },
      ],
    };
    const output = runScenario(input) as { results: ({ premium: number } | { payout: number; remainingCap: number })[] };
    expect(output.results[1]).toEqual({ payout: 900, remainingCap: 3100 });
  });

  // --- Error cases ---
  it("quote with unknown item type (e.g. broomstick) → runScenario throws (CLI translates to non-zero exit + stderr)", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "broomstick" }] }],
    };
    expect(() => runScenario(input)).toThrow(/broomstick|unknown/i);
  });
  it("claim references damage item not part of policy → runScenario throws", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: { cause: "fire", damages: [{ itemType: "amulet", amount: 200 }] },
        },
      ],
    };
    expect(() => runScenario(input)).toThrow(/amulet|not.*polic/i);
  });
  it("damages contains more entries of a type than policy covers → runScenario throws", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "dragon",
            damages: [
              { itemType: "sword", amount: 300 },
              { itemType: "sword", amount: 400 },
            ],
          },
        },
      ],
    };
    expect(() => runScenario(input)).toThrow(/sword|polic/i);
  });
  it("claim with negative damage amount → runScenario throws", () => {
    const input = {
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "sword" }] },
        {
          op: "claim",
          policy: 0,
          incident: {
            cause: "mystery",
            damages: [{ itemType: "sword", amount: -200 }],
          },
        },
      ],
    };
    expect(() => runScenario(input)).toThrow(/negative|amount/i);
  });
});
