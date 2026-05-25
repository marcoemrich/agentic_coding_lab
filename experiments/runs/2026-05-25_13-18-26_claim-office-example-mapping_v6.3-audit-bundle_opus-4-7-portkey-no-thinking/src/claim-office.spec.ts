import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // ---- Edge case: empty items ----
  it("quote with empty item list → premium 5 G (processing fee only)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // ---- Single item base premiums ----
  it("quote a plain sword for a newcomer → 100 + 10 + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote a plain amulet for a newcomer → 60 + 6 + 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote a plain staff for a newcomer → 80 + 8 + 5 = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote a plain potion for a newcomer → 40 + 4 + 5 = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // ---- Components and building blocks ----
  it("quote 2 runes → 50 + 5 + 5 = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("quote 3 runes (block applies) → 60 + 6 + 5 = 71 G", () => {
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
  it("quote 4 runes (no block) → 100 + 10 + 5 = 115 G", () => {
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
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote 7 runes → 175 + 17.5 + 5 rounded up = 198 G", () => {
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
  it("quote 2 runes + 1 moonstone → base 75 (no block), premium = 88 G", () => {
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
  it("quote 3 runes + 3 moonstones → 120 + 12 + 5 = 137 G", () => {
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
    expect(result).toEqual({ results: [{ premium: 137 }] });
  });

  // ---- Item-specific modifiers in isolation ----
  it("newcomer with cursed sword → 165 G", () => {
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
  it("sword enchantment 5 → high-enchantment 30 + first-ins 10 + fee = 145 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 5, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 145 }] });
  });
  it("sword enchantment 4 → no high-enchantment surcharge → 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        {
          op: "quote",
          items: [{ type: "sword", material: "steel", enchantment: 4, cursed: false }],
        },
      ],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it.todo("cursed sword with exactly enchantment 5 → both surcharges apply (curse 50 + high ench 30)");

  // ---- Policy-wide modifiers ----
  it.todo("customer with exactly 2 years with MHPCO → loyalty discount (20%) applies");
  it.todo("customer's first contract carries 10% initial assessment surcharge");
  it.todo("customer's second contract receives 15% follow-up discount");

  // ---- Rounding ----
  it.todo("premium calculation yielding 197.5 G → final premium 198 G (rounded up)");

  // ---- Modifier scope on multi-item policies ----
  it.todo("policy with cursed sword + plain amulet → cursed surcharge applies only to the cursed sword's base premium (210 G before further modifiers and fee)");

  // ---- Integration examples ----
  it.todo("integration: newcomer with cursed steel sword (enchantment 3) → 165 G");
  it.todo("integration: 3-year customer's second contract, cursed sword (enchantment 7) → 160 G");

  // ---- Quote unknown type ----
  it.todo("quote with an unknown item type (e.g. broomstick) → non-zero exit / error");

  // ---- Claim — standard reimbursement ----
  it.todo("claim: regular steel sword (enchantment 3), damage 500 G → payout 400 G");
  it.todo("claim: damage to a rune (insurance value 250 G), damage 200 G → payout 100 G");

  // ---- Claim — special clauses ----
  it.todo("claim: high-enchantment item (enchantment ≥ 8) is reimbursed at 50% before deductible");
  it.todo("claim: dragon-material item is fully reimbursed (minus deductible)");
  it.todo("claim: dragon-material sword with exactly enchantment 8, damage 1000 → 400 G (high-enchantment wins, then deductible)");
  it.todo("claim: dragon-material sword, enchantment 9, damage 1000 → 400 G");
  it.todo("claim: dragon-material sword, enchantment 5, damage 800 → 700 G (only dragon-material clause)");
  it.todo("claim: steel sword, enchantment 9, damage 1000 → 400 G (only high-enchantment clause)");

  // ---- Deductible per damage event ----
  it.todo("claim: dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible per item)");

  // ---- Multiple items of same type ----
  it.todo("policy covering two swords → insurance sum 2000 G, cap 4000 G; dragon attack damages both → each gets own deductible");
  it.todo("claim with more entries of a type than insured → CLI exits non-zero");

  // ---- Cap exhaustion ----
  it.todo("cap is based on unmodified insurance value (cursed sword → cap 2000 G regardless of premium modifiers)");
  it.todo("policy covering a sword and 3 runes → insurance sum 1750 G; block discount affects premium only");
  it.todo("policy covering a sword and an amulet → insurance sum 1600 G, cap 3200 G");
  it.todo("two successive claims on a sword (insurance 1000 G, cap 2000 G): first 1500 → 1400 payout, remainingCap 600; second 1500 → 600 payout, remainingCap 0");

  // ---- Payout rounding ----
  it.todo("payout calculation yielding 350.5 G → final payout 350 G (rounded down, in MHPCO's favor)");

  // ---- Claim errors ----
  it.todo("claim references damage to an item not in the policy → CLI exits non-zero");
  it.todo("claim references damage to an unknown item type → CLI exits non-zero");
  it.todo("claim contains damage with negative amount → CLI exits non-zero");

  // ---- CLI smoke ----
  it.todo("schema example: quote+claim scenario produces a results array of the same length");
});
