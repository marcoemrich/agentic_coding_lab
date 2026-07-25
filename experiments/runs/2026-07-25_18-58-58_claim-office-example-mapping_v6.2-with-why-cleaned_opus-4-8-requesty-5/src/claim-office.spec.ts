import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // --- Simplest quote cases ---
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // --- Base premiums for single main items (with first-insurance surcharge always applied) ---
  it("single plain sword, newcomer → base 100 + 10 first insurance + 5 fee = 115 G", () => {
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

  // --- Component base premiums ---
  it("2 runes → 50 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // 2×25 = 50 base + 10% first insurance (5) + 5 fee = 60
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → 60 G base premium (block applies)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }],
        },
      ],
    });
    // block: 60 base + 10% first insurance (6) + 5 fee = 71
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("4 runes → 100 G base premium (no block — block requires exactly 3)", () => {
    const result = runScenario({
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
    // no block: 4×25 = 100 base + 10% first insurance (10) + 5 fee = 115
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("7 runes → 175 G base premium", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: Array.from({ length: 7 }, () => ({ type: "rune" })),
        },
      ],
    });
    // no block: 7×25 = 175 base + 17.5 first insurance + 5 fee = 197.5 → ceil 198
    expect(result).toEqual({ results: [{ premium: 198 }] });
  });

  // --- 'Alike' components clarification ---
  it("2 runes + 1 moonstone → 75 G base premium (no block: different types)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "rune" }, { type: "rune" }, { type: "moonstone" }],
        },
      ],
    });
    // no block (types differ): 3×25 = 75 base + 7.5 first insurance + 5 fee = 87.5 → ceil 88
    expect(result).toEqual({ results: [{ premium: 88 }] });
  });
  it("3 runes + 3 moonstones → 120 G base premium (two separate blocks)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [
            { type: "rune" },
            { type: "rune" },
            { type: "rune" },
            { type: "moonstone" },
            { type: "moonstone" },
            { type: "moonstone" },
          ],
        },
      ],
    });
    // two blocks: 60 + 60 = 120 base + 12 first insurance + 5 fee = 137
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // --- Premium modifiers in isolation ---
  it("cursed sword adds 50% curse surcharge to item base", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 3, cursed: true }],
        },
      ],
    });
    // 100 base + 50 curse + 10 first insurance + 5 fee = 165
    expect(result).toEqual({ results: [{ premium: 165 }] });
  });
  it("sword enchantment 5 adds 30% high-enchantment surcharge", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    // 100 base + 30 high-ench + 10 first insurance + 5 fee = 145
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it.todo("sword enchantment 4 → no high-enchantment surcharge");
  it.todo("sword enchantment 5 and cursed → both surcharges apply");
  it.todo("customer with exactly 2 years → 20% loyalty discount applies");

  // --- Modifier scope on multi-item policies ---
  it.todo("cursed sword (100) + plain amulet (60): policy base 160, curse adds 50 → 210 before fee");

  // --- Rounding ---
  it.todo("premium calculation yielding 197.5 G → 198 G (rounded up)");

  // --- Integration examples ---
  it.todo("newcomer with cursed sword (steel, ench 3), 0 years, first quote → premium 165 G");
  it.todo("long-standing customer's 2nd contract: cursed sword (ench 7), 3 years → premium 160 G");
  it.todo("first insurance surcharge applies to each item even on a follow-up contract");

  // --- Claim: standard reimbursement ---
  it.todo("regular sword (steel, ench 3), damage 500 → payout 400 G (500 - 100 deductible)");
  it.todo("rune damage 200 (no ench/material) → payout 100 G (200 - 100 deductible)");

  // --- Claim: special clauses ---
  it.todo("steel sword ench 9, damage 1000 → payout 400 G (50% then deductible: 500 - 100)");
  it.todo("dragon-material sword ench 5, damage 800 → payout 700 G (full then deductible)");
  it.todo("dragon-material sword ench 9, damage 1000 → payout 400 G (50% wins: 500 - 100)");
  it.todo("dragon-material sword exactly ench 8, damage 1000 → payout 400 G (high-ench then deductible)");

  // --- Claim: deductible per damage event ---
  it.todo("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible per item)");

  // --- Claim: multiple items of same type ---
  it.todo("policy covers two swords → insurance sum 2000, cap 4000; both damaged, separate deductibles");
  it.todo("more damage entries of a type than insured → CLI rejects (non-zero exit)");

  // --- Claim: cap and insurance sum ---
  it.todo("sword + amulet → insurance sum 1600, cap 3200");
  it.todo("cursed sword → cap 2000 based on unmodified insurance value");
  it.todo("sword + 3 runes → insurance sum 1750 (block discount does not affect insurance sum)");
  it.todo("cap exhaustion: two 1500 claims → first payout 1400 (remaining 600), second payout 600 (remaining 0)");

  // --- Payout rounding ---
  it.todo("payout calculation yielding 350.5 G → payout 350 G (rounded down)");

  // --- Error cases ---
  it.todo("quote with unknown item type → throws / non-zero exit, no results");
  it.todo("claim referencing an item not in the policy → throws / non-zero exit");
  it.todo("claim damage entry with negative amount → throws / non-zero exit");
});
