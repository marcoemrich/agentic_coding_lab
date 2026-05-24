import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === Simplest cases ===
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result.results[0]).toEqual({ premium: 5 });
  });

  // === Base premiums per item type ===
  it("single sword → base premium 100 G + first insurance 10 G + fee 5 G = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it("single amulet → 60 G base + 6 G first insurance + 5 G fee = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("single staff → 80 + 8 + 5 = 93 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 93 });
  });
  it("single potion → 40 + 4 + 5 = 49 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result.results[0]).toEqual({ premium: 49 });
  });

  // === Components (runes/moonstones) ===
  it("2 runes → 50 G base + 5 G first insurance + 5 G fee = 60 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 60 });
  });
  it("3 runes → 60 G base (block) + 6 + 5 = 71 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 71 });
  });
  it("4 runes → 100 G base (no block) + 10 + 5 = 115 G", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] },
      ],
    });
    expect(result.results[0]).toEqual({ premium: 115 });
  });
  it.todo("7 runes → 175 G base premium (3 in a block + 4 individuals)");

  // === Alike components clarification ===
  it.todo("2 runes + 1 moonstone → 75 G base premium (no block: different types)");
  it.todo("3 runes + 3 moonstones → 120 G base premium (two separate blocks)");

  // === Item-specific modifiers ===
  it.todo("cursed sword adds 50% of sword base premium as surcharge");
  it.todo("highly enchanted item (enchantment ≥ 5) adds 30% surcharge");
  it.todo("sword with exactly enchantment 5 → high-enchantment surcharge applies");
  it.todo("sword with enchantment 4 → no high-enchantment surcharge");
  it.todo("cursed sword with enchantment 5 → both curse and high-enchantment surcharges apply");

  // === Policy-wide modifiers ===
  it.todo("customer with ≥ 2 years (loyalty) receives 20% discount on policy base premium");
  it.todo("customer with exactly 2 years → loyalty discount applies");
  it.todo("first insurance carries 10% initial assessment surcharge per item");
  it.todo("each contract after the first gets 15% follow-up discount");

  // === Multi-item modifier scope ===
  it.todo("cursed sword + plain amulet → 210 G before further modifiers and fee");

  // === Rounding ===
  it.todo("premium yielding 197.5 G → rounded up to 198 G (in MHPCO's favor)");
  it.todo("payout yielding 350.5 G → rounded down to 350 G (in MHPCO's favor)");

  // === Integration examples ===
  it.todo("newcomer (0 years, no prior) with cursed sword enchantment 3 → premium 165 G");
  it.todo("long-standing customer (3 years) second quote, cursed sword enchantment 7 → premium 160 G");

  // === Claim — standard reimbursement ===
  it.todo("regular sword (steel, enchantment 3), damage 500 G → payout 400 G");
  it.todo("rune damage 200 G → payout 100 G");

  // === Claim — high enchantment clause ===
  it.todo("steel sword enchantment 9, damage 1000 G → payout 400 G (50% then deductible)");
  it.todo("dragon-material sword enchantment 8, damage 1000 G → payout 400 G (high-enchantment wins)");

  // === Claim — dragon material clause ===
  it.todo("dragon-material sword enchantment 5, damage 800 G → payout 700 G (full reimbursement minus deductible)");
  it.todo("dragon-material sword enchantment 9, damage 1000 G → payout 400 G (50% rule wins)");

  // === Deductible per damage event ===
  it.todo("dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G (deductible per item)");

  // === Multiple items of same type ===
  it.todo("policy covers two swords → insurance sum 2000 G, cap 4000 G");
  it.todo("two sword damages with both swords insured → each treated separately with own deductible");
  it.todo("more damage entries than insured items of that type → CLI rejects claim");

  // === Cap exhaustion ===
  it.todo("sword + amulet policy → insurance sum 1600 G, cap 3200 G");
  it.todo("cursed sword → cap 2000 G (based on unmodified insurance value)");
  it.todo("sword + 3 runes block → insurance sum 1750 G (block discount affects premium only)");
  it.todo("sword cap 2000 G, two successive 1500 G claims → first payout 1400 G, second 600 G");

  // === Error handling ===
  it.todo("quote with unknown item type → CLI exits non-zero, error to stderr");
  it.todo("claim references damage for item not in policy → CLI exits non-zero");
  it.todo("claim with negative damage amount → CLI exits non-zero");
});
