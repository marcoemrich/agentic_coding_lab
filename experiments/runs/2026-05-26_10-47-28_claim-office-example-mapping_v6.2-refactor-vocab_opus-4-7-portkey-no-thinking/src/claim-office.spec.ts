import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Edge case: empty items
  it("empty item list → premium 5 G (only the processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums per item type (single item, no modifiers, newcomer 0 years, first contract)
  // With 0 years (no loyalty), first contract = no follow-up discount but the spec says
  // "each item in a quote is treated as a first insurance", so +10% per item applies.
  // For pure base premium tests we use multi-step or rely on the integration example math.
  // Simpler: test the single-item quote with newcomer 0 years, no curse, low enchantment.

  // We'll test via runScenario (the top-level entry point).
  it("quote a plain sword for newcomer (0 yrs, 1st contract) → 100 base + 10 first ins + 5 fee = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 3, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("quote a plain amulet for newcomer → 60 + 6 + 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("quote a plain staff for newcomer → 80 + 8 + 5 = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 2, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("quote a plain potion for newcomer → 40 + 4 + 5 = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 1, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // Components
  it("quote 1 rune for newcomer → 25 + 2.5 first ins = 27.5 → 28 + 5 = 33 G (rounded up in MHPCO favor)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it("quote 2 runes for newcomer → 50 base + 5 first ins = 55 + 5 = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });

  // Block discount
  it.todo("3 runes form a block → 60 base premium (block applies)");
  it.todo("4 runes → 100 base premium (no block — block requires exactly 3)");
  it.todo("7 runes → 175 base premium (one block of 3 = 60, plus 4 individual = 100)");

  // Alike-components clarification
  it.todo("2 runes + 1 moonstone → 75 base premium (no block: different types)");
  it.todo("3 runes + 3 moonstones → 120 base premium (two separate blocks)");

  // Modifier thresholds
  it.todo("customer with exactly 2 years gets loyalty discount");
  it.todo("sword with exactly enchantment 5 → high-enchantment surcharge applies");
  it.todo("sword with enchantment 4 → no high-enchantment surcharge");
  it.todo("cursed sword with enchantment 5 → both surcharges apply");

  // Modifier scope on multi-item policies
  it.todo("policy with cursed sword + plain amulet → curse surcharge applies only to sword's base (210 G before fee)");

  // Rounding in MHPCO's favor
  it.todo("premium 197.5 G → rounded up to 198 G");
  it.todo("payout 350.5 G → rounded down to 350 G");

  // Integration: Newcomer with a cursed sword
  it.todo("newcomer with cursed sword (steel, enchantment 3) → 165 G");

  // Integration: Long-standing customer's second contract
  it.todo("3-yr customer's 2nd contract, cursed sword enchantment 7 → 160 G");

  // Claim processing — standard reimbursement
  it.todo("regular sword, damage 500 G → payout 400 G (full minus 100 deductible)");
  it.todo("rune damage 200 G → payout 100 G (no special clause, minus deductible)");

  // Claim — high enchantment clause
  it.todo("steel sword enchantment 9, damage 1000 G → payout 400 G (50% then deductible)");

  // Claim — dragon material
  it.todo("dragon-material sword enchantment 5, damage 800 G → payout 700 G (full, then deductible)");

  // Claim — both clauses (enchantment wins precedence-ordered with 50% then deductible)
  it.todo("dragon-material sword enchantment 9, damage 1000 G → payout 400 G");
  it.todo("dragon-material sword enchantment exactly 8, damage 1000 G → payout 400 G");

  // Claim — deductible per damage event (per item)
  it.todo("dragon attack damages sword (500) and amulet (300) → payout 600 G (100 deductible per item)");

  // Multiple items of same type
  it.todo("policy covers 2 swords → insurance sum 2000, cap 4000");
  it.todo("two swords policy, damages list two sword entries → each treated as separate damage with own deductible");
  it.todo("damages has more entries of a type than insured → CLI rejects (non-zero exit)");

  // Cap exhaustion
  it.todo("sword+amulet policy → insurance sum 1600 G, cap 3200 G");
  it.todo("cursed sword → cap based on unmodified insurance value (2000 G)");
  it.todo("sword + 3 runes (block) → insurance sum 1750 G (block discount doesn't affect insurance sum)");
  it.todo("successive claims on sword (cap 2000): first 1500→pay 1400 cap 600, second 1500→pay 600 cap 0");

  // CLI error handling (these are exercised via the CLI, but logic can return errors)
  it.todo("quote with unknown item type → CLI exits non-zero with stderr error");
  it.todo("claim references damage for item not in policy → CLI exits non-zero");
  it.todo("claim damage with negative amount → CLI exits non-zero");
});
