import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === Empty / processing fee ===
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // === Base premiums per main item type ===
  it("single plain sword → premium 115 G (100 base + 10 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("single plain amulet → premium 71 G (60 base + 6 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("single plain staff → premium 93 G (80 base + 8 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("single plain potion → premium 49 G (40 base + 4 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // === Components ===
  it("2 runes → 60 G premium (2×25 base + 5 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes → 71 G premium (block: 60 base + 6 first-insurance + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes → 115 G premium (no block — block requires exactly 3)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it.todo("7 runes → 180 G premium (175 base + 5 fee)");

  // === "Alike" components ===
  it.todo("2 runes + 1 moonstone → 80 G premium (75 base + 5 fee, no block: different types)");
  it.todo("3 runes + 3 moonstones → 125 G premium (two separate blocks: 60+60 + 5 fee)");

  // === Item-specific modifiers ===
  it.todo("cursed sword (newcomer, no first-insurance) — curse surcharge is 50% of cursed item's base premium");
  it.todo("sword with enchantment exactly 5 → high-enchantment surcharge applies (30%)");
  it.todo("sword with enchantment 4 → no high-enchantment surcharge");
  it.todo("cursed sword with enchantment 5 → both surcharges apply");

  // === Policy-wide modifiers ===
  it.todo("customer with exactly 2 years → loyalty discount applies (20%)");
  it.todo("first insurance carries 10% initial assessment surcharge");
  it.todo("customer's second contract gets 15% follow-up discount");

  // === Modifier scope on multi-item policies ===
  it.todo("cursed sword + plain amulet → policy 215 G (160 base + 50 curse + 5 fee)");

  // === Integration: newcomer with cursed sword ===
  it.todo("newcomer (0 years) cursed sword (enchantment 3) → premium 165 G");

  // === Integration: long-standing customer's second contract ===
  it.todo("3-year customer, second quote, cursed sword (enchantment 7) → premium 160 G");

  // === Rounding ===
  it.todo("premium yielding 197.5 G → final 198 G (rounded up)");

  // === Claim: standard reimbursement ===
  it.todo("regular sword (steel, enchantment 3), damage 500 G → payout 400 G");
  it.todo("rune damage 200 G → payout 100 G (no special clauses)");

  // === Claim: enchantment threshold ===
  it.todo("steel sword enchantment 9, damage 1000 G → payout 400 G (50% then deductible)");

  // === Claim: dragon material ===
  it.todo("dragon-material sword enchantment 5, damage 800 G → payout 700 G (full reimbursement minus deductible)");

  // === Claim: both clauses ===
  it.todo("dragon-material sword enchantment 9, damage 1000 G → payout 400 G (50% rule wins, then deductible)");
  it.todo("dragon-material sword enchantment exactly 8, damage 1000 G → payout 400 G (high-enchant then deductible)");

  // === Claim: deductible per damage event ===
  it.todo("dragon attack damages insured sword 500 G + amulet 300 G → payout 600 G (deductible per item)");

  // === Multiple items of same type ===
  it.todo("policy covers two swords → insurance sum 2000 G, cap 4000 G");
  it.todo("policy covers two swords, dragon attack damages both → each damage has its own deductible");
  it.todo("damages array has more entries of a type than the policy covers → CLI exits non-zero");

  // === Cap exhaustion ===
  it.todo("sword + amulet → insurance sum 1600 G, cap 3200 G");
  it.todo("cursed sword → cap 2000 G (based on unmodified insurance value)");
  it.todo("sword + 3 runes block → insurance sum 1750 G (block discount affects premium only)");
  it.todo("sword cap 2000 G, two 1500 G claims → first payout 1400 G remaining 600 G; second payout 600 G remaining 0 G");

  // === Payout rounding ===
  it.todo("payout calc yielding 350.5 G → final payout 350 G (rounded down)");

  // === Edge cases / errors ===
  it.todo("quote with unknown item type → CLI exits non-zero, error to stderr, no results to stdout");
  it.todo("claim references damage for item not in policy → CLI exits non-zero");
  it.todo("claim damage entry with negative amount → CLI exits non-zero");
});
