import { describe, it, expect } from "vitest";
import { runScenario } from "./claim-office.js";

describe("MHPCO Claim Office", () => {
  // Edge case: empty item list
  it("empty item list → premium 5 G (only processing fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [] }],
    });
    expect(result).toEqual({ results: [{ premium: 5 }] });
  });

  // Base premiums for main items (with processing fee)
  it("single plain sword (steel, enchantment 0) → premium 105 G (100 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "sword", material: "steel", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 105 }] });
  });
  it("single plain amulet → premium 65 G (60 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "amulet", material: "silver", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 65 }] });
  });
  it("single plain staff → premium 85 G (80 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "staff", material: "wood", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 85 }] });
  });
  it("single plain potion → premium 45 G (40 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "potion", material: "glass", enchantment: 0, cursed: false }] }],
    });
    expect(result).toEqual({ results: [{ premium: 45 }] });
  });

  // Component pricing
  it("2 runes → 55 G premium (50 base + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 55 }] });
  });
  it("3 runes → 65 G premium (60 base block + 5 fee)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 65 }] });
  });
  it("4 runes → 105 G premium (100 base + 5 fee, no block)", () => {
    const result = runScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [{ op: "quote", items: [{ type: "rune" }, { type: "rune" }, { type: "rune" }, { type: "rune" }] }],
    });
    expect(result).toEqual({ results: [{ premium: 105 }] });
  });
  it.todo("7 runes → 180 G premium (175 base + 5 fee)");
  it.todo("2 runes + 1 moonstone → 80 G premium (75 base, no block since different types)");
  it.todo("3 runes + 3 moonstones → 125 G premium (120 base, two separate blocks)");

  // Item-specific modifiers (cursed, high enchantment)
  it.todo("cursed sword (enchantment 3) → curse surcharge 50%: 100 + 50 + 5 = 155 G");
  it.todo("sword with enchantment 5 → high-enchant surcharge 30%: 100 + 30 + 5 = 135 G");
  it.todo("sword with enchantment 4 → no high-enchant surcharge: 100 + 5 = 105 G");
  it.todo("cursed sword with enchantment 5 → both surcharges: 100 + 50 + 30 + 5 = 185 G");

  // Policy-wide modifiers
  it.todo("customer with 2 years → loyalty discount 20% applies");
  it.todo("customer with 0 years → no loyalty discount");

  // Modifier scope on multi-item policies
  it.todo("cursed sword + plain amulet → curse applies to sword only: 100+60+50+5 = 215 G");

  // First insurance surcharge
  it.todo("first insurance per item: +10% per item base premium");

  // Follow-up contract discount
  it.todo("second quote gets 15% follow-up discount on policy base");

  // Rounding
  it.todo("premium 197.5 G → rounded up to 198 G (in MHPCO's favor)");

  // Integration examples
  it.todo("newcomer with cursed sword (steel, enchantment 3): 0 years, first contract → premium 165 G");
  it.todo("long-standing customer's 2nd contract: cursed sword enchant 7, 3 years → premium 160 G");

  // Claim: standard reimbursement
  it.todo("claim on plain sword (enchant 3), damage 500 G → payout 400 G");
  it.todo("claim on rune, damage 200 G → payout 100 G (no special clause)");

  // Claim: enchantment threshold
  it.todo("claim on steel sword, enchantment 9, damage 1000 G → payout 400 G (50% then deductible)");

  // Claim: dragon material
  it.todo("claim on dragon sword, enchantment 5, damage 800 G → payout 700 G (full minus deductible)");
  it.todo("claim on dragon sword, enchantment 9, damage 1000 G → payout 400 G (50% wins, then deductible)");
  it.todo("claim on dragon sword, enchantment 8, damage 1000 G → payout 400 G (high-enchant clause applies)");

  // Claim: deductible per damage event
  it.todo("dragon attack damages sword (500) and amulet (300) → payout 600 G (deductible per item)");

  // Claim: payout rounding (down)
  it.todo("payout 350.5 G → final payout 350 G (rounded down in MHPCO's favor)");

  // Multiple items of same type
  it.todo("policy with 2 swords → insurance sum 2000, cap 4000; two damages each get own deductible");
  it.todo("damages array has more entries of a type than policy covers → CLI exits non-zero");

  // Cap exhaustion
  it.todo("sword + amulet → insurance sum 1600, cap 3200");
  it.todo("cursed sword (premium 165) → cap 2000 (based on unmodified insurance value)");
  it.todo("sword + 3 runes block → insurance sum 1750 (block affects premium only)");
  it.todo("sword 2 successive claims of 1500 each → first payout 1400 (cap 600 left), second payout 600 (cap 0)");

  // Error cases
  it.todo("quote with unknown item type → CLI exits non-zero with stderr error");
  it.todo("claim references item not in policy → CLI exits non-zero with stderr error");
  it.todo("claim damage with negative amount → CLI exits non-zero with stderr error");
});
