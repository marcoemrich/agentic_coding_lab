import { describe, it, expect } from "vitest";
import { processScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // === Simplest cases ===
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // === Base premiums for individual items (with processing fee) ===
  it("single sword (newcomer, first quote) → premium 115 G (100 + 10 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 115 }] });
  });
  it("single amulet (newcomer, first quote) → premium 71 G (60 + 6 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it("single staff (newcomer) → premium 93 G (80 + 8 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 93 }] });
  });
  it("single potion (newcomer) → premium 49 G (40 + 4 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 49 }] });
  });

  // === Components ===
  it("single rune (newcomer) → premium 33 G (ceil(25*1.1)=28 + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 33 }] });
  });
  it.todo("single moonstone → premium 30 G (25 base + 5 fee)");
  it("2 runes (newcomer) → premium 60 G (2×25=50 base + 5 first ins + 5 fee, no block)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 60 }] });
  });
  it("3 runes → premium 71 G (60 block + 6 first ins + 5 fee)", () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 71 }] });
  });
  it.todo("4 runes → premium 105 G (100 base, no block — block requires exactly 3)");
  it.todo("7 runes → premium 180 G (175 base + 5 fee)");

  // === Alike components — block requires same type ===
  it.todo("2 runes + 1 moonstone → premium 80 G (75 base + 5 fee, no block)");
  it.todo("3 runes + 3 moonstones → premium 125 G (120 base + 5 fee, two separate blocks)");

  // === Item-specific modifiers ===
  it.todo("cursed sword → premium 155 G (100 + 50 curse + 5 fee)");
  it.todo("sword enchantment 5 → premium 135 G (100 + 30 high-ench + 5 fee)");
  it.todo("sword enchantment 4 → premium 105 G (no high-ench surcharge)");
  it.todo("cursed sword enchantment 5 → premium 185 G (100 + 50 + 30 + 5)");

  // === Policy-wide modifiers ===
  it.todo("loyalty: 2 years exactly → 20% discount applies (sword: 100 - 20 + 5 = 85)");
  it.todo("loyalty: 1 year → no discount (sword: 100 + 5 = 105)");
  it.todo("first insurance (first quote) → 10% surcharge added");
  it.todo("second quote → 15% follow-up discount applies");

  // === Modifier scope on multi-item policies ===
  it.todo("cursed sword + plain amulet → 215 G (item-specific curse on sword only) [100+60=160, +50 curse, +10 first ins on 100, +5 fee = 225? recheck]");
  it.todo("modifier scope: item-specific applies to item base, policy-wide to total");

  // === Rounding (in MHPCO's favor) ===
  it.todo("premium yielding 197.5 G → rounded up to 198 G");
  it.todo("payout yielding 350.5 G → rounded down to 350 G");

  // === Integration examples ===
  it.todo("newcomer with cursed sword (steel, ench 3) → premium 165 G");
  it.todo("long-standing customer (3 years), second contract, cursed sword ench 7 → 160 G");

  // === Claim: standard reimbursement ===
  it.todo("regular sword (steel, ench 3), damage 500 → payout 400");
  it.todo("damage to rune (insurance 250), damage 200 → payout 100");

  // === Claim: high enchantment clause ===
  it.todo("steel sword ench 9, damage 1000 → payout 400 (50% then deductible)");

  // === Claim: dragon material clause ===
  it.todo("dragon sword ench 5, damage 800 → payout 700 (full minus deductible)");

  // === Claim: both clauses (50% wins) ===
  it.todo("dragon sword ench 9, damage 1000 → payout 400 (50% wins, then deductible)");
  it.todo("dragon sword ench 8 exactly, damage 1000 → payout 400 (high-ench wins, then deductible)");

  // === Deductible per damage event (per item) ===
  it.todo("dragon attack damages sword (500) and amulet (300) → payout 600 (deductible per item)");

  // === Multiple items of same type ===
  it.todo("policy with two swords, both damaged → each gets own deductible");
  it.todo("damage entries exceed insured count → claim rejected (non-zero exit)");

  // === Cap on policy ===
  it.todo("sword (cap 2000), claim 1500 → payout 1400, remainingCap 600");
  it.todo("sword (cap 2000), second claim 1500 after 1400 paid → payout 600, remainingCap 0");
  it.todo("cursed sword cap 2000 (based on unmodified insurance value)");
  it.todo("sword + 3 runes block → insurance sum 1750 (block affects premium, not sum)");

  // === Error handling ===
  it.todo("quote with unknown item type → CLI exits non-zero, error on stderr");
  it.todo("claim references item not in policy → CLI exits non-zero, error on stderr");
  it.todo("claim with negative damage amount → CLI exits non-zero, error on stderr");
});
