import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest cases ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums for main items ---
  it("single sword → base premium 100 G + 10 G first insurance + 5 G fee = 115 G for new customer", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet → base premium 60 G + 6 G first insurance + 5 G fee = 71 G for new customer", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "amulet", material: "silver", enchantment: 2, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff → base premium 80 G + 8 G first insurance + 5 G fee = 93 G for new customer", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "staff", material: "wood", enchantment: 1, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion → base premium 40 G + 4 G first insurance + 5 G fee = 49 G for new customer", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // --- Components and building blocks ---
  it("2 runes → 50 G base premium (no block) → 50 + 5 first + 5 fee = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies) → 60 + 6 first + 5 fee = 71 G", () => {
    const result = runScenario({
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
  it("4 runes → 100 G base premium (no block) → 100 + 10 first + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium (no block) → 175 + 17.5 first + 5 fee = 197.5 → 198 G", () => {
    const result = runScenario({
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

  // --- Alike components clarification ---
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types) → 88 G", () => {
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
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks) → 137 G", () => {
    const result = runScenario({
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
    });
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Premium modifiers in isolation ---
  it("cursed sword for new customer → 100 + 50 curse + 10 first = 160 + 5 fee = 165 G", () => {
    const result = runScenario({
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
  it.todo("sword with enchantment exactly 5 → high-enchantment surcharge applies (30%)");
  it.todo("sword with enchantment 4 → no high-enchantment surcharge");
  it.todo("cursed sword with enchantment 5 → both curse and high-enchantment surcharges apply");
  it.todo("customer with exactly 2 years with MHPCO → loyalty discount applies (20%)");
  it.todo("customer with less than 2 years → no loyalty discount");
  it.todo("first insurance carries 10% initial assessment surcharge on each item");
  it.todo("follow-up contract: 15% discount on each contract after the first");
  it.todo("5 G processing fee added to every premium");

  // --- Rounding ---
  it.todo("premium calculation yielding 197.5 G → rounded up to 198 G (MHPCO's favor)");
  it.todo("payout calculation yielding 350.5 G → rounded down to 350 G (MHPCO's favor)");
  it.todo("intermediate amounts are kept as fractions; only final amount is rounded");

  // --- Modifier scope on multi-item policies ---
  it.todo("cursed sword + plain amulet → curse surcharge applies only to the sword's base premium → 210 G before fee");
  it.todo("policy-wide modifiers (loyalty, first-insurance, follow-up) apply to the policy base premium");

  // --- Integration examples ---
  it.todo("newcomer with cursed sword (steel, ench 3) → premium 165 G");
  it.todo("long-standing customer's second contract with cursed sword (ench 7) → premium 160 G");

  // --- Claim processing: deductible and standard ---
  it.todo("regular sword (steel, ench 3), damage 500 G → payout 400 G (full minus 100 deductible)");
  it.todo("damage to a rune (insurance value 250 G), damage 200 G → payout 100 G");

  // --- Claim processing: special clauses ---
  it.todo("dragon-material sword, enchantment 8, damage 1000 G → payout 400 G (50% then deductible)");
  it.todo("dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% wins, then deductible)");
  it.todo("dragon-material sword, enchantment 5, damage 800 G → payout 700 G (dragon-material full, then deductible)");
  it.todo("steel sword, enchantment 9, damage 1000 G → payout 400 G (high-enchantment 50%, then deductible)");

  // --- Multiple damages in single event ---
  it.todo("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible per item)");

  // --- Multiple items of the same type ---
  it.todo("policy covers two swords → insurance sum 2000 G, cap 4000 G");
  it.todo("dragon attack damages both of two swords → each damage entry treated separately with own deductible");
  it.todo("damages array has more entries of a type than the policy covers → CLI exits non-zero, whole claim rejected");

  // --- Cap exhaustion ---
  it.todo("sword + amulet → insurance sum 1600 G, cap 3200 G");
  it.todo("cursed sword → cap 2000 G (based on unmodified insurance value, premium modifiers don't raise cap)");
  it.todo("sword + 3 runes → insurance sum 1750 G (block discount affects premium only, not insurance sum)");
  it.todo("two successive claims of 1500 G on sword (cap 2000): first payout 1400, second payout 600");

  // --- Edge cases / errors ---
  it.todo("quote with unknown item type (e.g. broomstick) → CLI exits non-zero, error to stderr, no results");
  it.todo("claim references damage entry whose item is not part of the policy → CLI exits non-zero with error");
  it.todo("claim references damage entry with unknown item type → CLI exits non-zero with error");
  it.todo("claim contains damage entry with negative amount → CLI exits non-zero with error");

  // --- CLI scenario sequencing ---
  it.todo("scenario with quote then claim referencing policy index 0 produces results in order");
});
